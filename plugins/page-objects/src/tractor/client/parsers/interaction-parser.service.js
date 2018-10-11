// Module:
import { PageObjectsModule } from '../page-objects.module';

// Queries:
const ACTION_CALL_EXPRESSION_QUERY = 'CallExpression[callee.object.name="result"] > FunctionExpression > BlockStatement > ReturnStatement >';
const ACTION_CALL_EXPRESSION_NOT_OPTIONAL_QUERY = `${ACTION_CALL_EXPRESSION_QUERY} CallExpression[callee.property.name!="catch"]`;
const ACTION_CALL_EXPRESSION_OPTIONAL_QUERY = `${ACTION_CALL_EXPRESSION_QUERY} CallExpression[callee.property.name="catch"]`;
const ACTION_MEMBER_EXPRESSION_QUERY = 'MemberExpression[object.name!="self"][property.type="Identifier"]';
const ELEMENT_MEMBER_EXPRESSION_QUERY = 'MemberExpression > MemberExpression[object.type="Identifier"][property.type="Identifier"]';
const ELEMENT_GROUP_MEMBER_EXPRESSION_QUERY = 'MemberExpression > CallExpression > MemberExpression[object.type="Identifier"][property.type="Identifier"]';
const ELEMENT_GROUP_SELECTOR_QUERY = 'CallExpression > MemberExpression > CallExpression';
const PLUGIN_MEMBER_EXPRESSION_QUERY = 'MemberExpression[object.type="Identifier"][property.type="Identifier"]';

// Constants:
import { ELEMENT_GROUP_SELECTOR_ARGUMENT } from '../models/meta/element-group-selector-argument';

// Dependencies:
import esquery from 'esquery';
import '../models/interaction';
import './action-argument-parser.service';

function InteractionParserService (
    InteractionModel,
    astCompareService,
    actionArgumentParserService
) {
    const QUERIES = {
        [ACTION_CALL_EXPRESSION_NOT_OPTIONAL_QUERY]: _interactionParser,
        [ACTION_CALL_EXPRESSION_OPTIONAL_QUERY]: _optionalInteractionParser
    };

    return { parse };

    function parse (action, astObject) {
        let interaction = new InteractionModel(action);

        Object.keys(QUERIES).find(query => {
            let [result] = esquery(astObject, query);
            if (result) {
                QUERIES[query](interaction, result);
                return interaction;
            }
        });

        let parsedCorrectly = astCompareService.compare(astObject, interaction.ast);
        if (!parsedCorrectly) {
            interaction.isUnparseable = astObject;
        }

        return interaction;
    }

    function _actionParser (pageObject, astObject) {
        let { actions } = pageObject;
        let [actionMemberExpression] = esquery(astObject, ACTION_MEMBER_EXPRESSION_QUERY);
        return actionMemberExpression && actions.find(action => action.variableName === actionMemberExpression.property.name);
    }

    function _elementParser (pageObject, astObject) {
        let { elements } = pageObject;
        let [elementMemberExpression] = esquery(astObject, ELEMENT_MEMBER_EXPRESSION_QUERY);
        return elementMemberExpression && elements.find(element => element.variableName === elementMemberExpression.property.name);
    }

    function _elementGroupParser (pageObject, astObject) {
        let { elements } = pageObject;
        let [elementGroupMemberExpression] = esquery(astObject, ELEMENT_GROUP_MEMBER_EXPRESSION_QUERY);
        return elementGroupMemberExpression && elements.find(element => element.variableName === elementGroupMemberExpression.property.name);
    }

    function _interactionParser (interaction, astObject) {
        const { pageObject } = interaction.containingAction;

        const plugin = _pluginParser(pageObject, astObject);
        if (plugin) {
            interaction.element = plugin;
        }

        if (!plugin) {
            let element = _elementParser(pageObject, astObject);
            if (!element) {
                element = _elementGroupParser(pageObject, astObject);
            }
            if (element) {
                interaction.element = element;
            }

            const selector = _selectorParser(interaction, astObject);
            if (selector) {
                interaction.selector = selector;
            }
        }

        if (interaction.element) {
            interaction.action = _actionParser(interaction.element, astObject);
        }

        if (interaction.action) {
            let { parameters } = interaction.action;
            interaction.actionInstance.arguments = astObject.arguments.map((argument, index) => {
                return actionArgumentParserService.parse(interaction, parameters[index], argument);
            });    
        }
    }

    function _optionalInteractionParser (interaction, astObject) {
        interaction.isOptional = true;
        _interactionParser(interaction, astObject.callee.object);
    }

    function _pluginParser (pageObject, astObject) {
        let { plugins } = pageObject;
        let [pluginMemberExpression] = esquery(astObject, PLUGIN_MEMBER_EXPRESSION_QUERY);
        if (pluginMemberExpression) {
            return pluginMemberExpression && plugins.find(plugin => plugin.instanceName === pluginMemberExpression.object.name);
        }
    }

    function _selectorParser (interaction, astObject) {
        let [selectorCallExpression] = esquery(astObject, ELEMENT_GROUP_SELECTOR_QUERY);
        if (selectorCallExpression) {
            let [argument] = selectorCallExpression.arguments;
            return actionArgumentParserService.parse(interaction, ELEMENT_GROUP_SELECTOR_ARGUMENT, argument);    
        }
    }
}

PageObjectsModule.service('interactionParserService', InteractionParserService);
