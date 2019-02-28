// Module:
import { PageObjectsModule } from '../page-objects.module';

// Constants:
import { ELEMENT_GROUP_SELECTOR_ARGUMENT } from '../models/meta/element-group-selector-argument';

// Dependencies:
import { match, parse } from 'esquery';
import '../models/interaction';
import './action-argument-parser.service';

// Queries:
const ACTION_CALL_EXPRESSION_QUERY = 'CallExpression[callee.object.name="result"] > FunctionExpression > BlockStatement > ReturnStatement >';
const ACTION_CALL_EXPRESSION_NOT_OPTIONAL_QUERY = parse(`${ACTION_CALL_EXPRESSION_QUERY} CallExpression[callee.property.name!="catch"]`);
const ACTION_CALL_EXPRESSION_OPTIONAL_QUERY = parse(`${ACTION_CALL_EXPRESSION_QUERY} CallExpression[callee.property.name="catch"]`);
const ACTION_MEMBER_EXPRESSION_QUERY = parse('MemberExpression[object.name!="self"][property.type="Identifier"]');
const ELEMENT_MEMBER_EXPRESSION_QUERY = parse('MemberExpression > MemberExpression[object.type="Identifier"][property.type="Identifier"]');
const ELEMENT_GROUP_MEMBER_EXPRESSION_QUERY = parse('MemberExpression > CallExpression > MemberExpression[object.type="Identifier"][property.type="Identifier"]');
const ELEMENT_GROUP_SELECTOR_QUERY = parse('CallExpression > MemberExpression > CallExpression');
const PLUGIN_MEMBER_EXPRESSION_QUERY = parse('MemberExpression[object.type="Identifier"][property.type="Identifier"]');

function InteractionParserService (
    InteractionModel,
    astCompareService,
    actionArgumentParserService
) {
    const QUERY_SELECTOR = {
        notOptional: ACTION_CALL_EXPRESSION_NOT_OPTIONAL_QUERY,
        optional: ACTION_CALL_EXPRESSION_OPTIONAL_QUERY
    };
    const QUERY_HANDLER = {
        notOptional: _interactionParser,
        optional: _optionalInteractionParser
    };

    return { parse };

    function parse (action, astObject) {
        let interaction = new InteractionModel(action);

        Object.keys(QUERY_SELECTOR).find(key => {
            let [result] = match(astObject, QUERY_SELECTOR[key]);
            if (result) {
                QUERY_HANDLER[key](interaction, result);
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
        let [actionMemberExpression] = match(astObject, ACTION_MEMBER_EXPRESSION_QUERY);
        return actionMemberExpression && actions.find(action => action.variableName === actionMemberExpression.property.name);
    }

    function _elementParser (pageObject, astObject) {
        let { elements } = pageObject;
        let [elementMemberExpression] = match(astObject, ELEMENT_MEMBER_EXPRESSION_QUERY);
        return elementMemberExpression && elements.find(element => element.variableName === elementMemberExpression.property.name);
    }

    function _elementGroupParser (pageObject, astObject) {
        let { elements } = pageObject;
        let [elementGroupMemberExpression] = match(astObject, ELEMENT_GROUP_MEMBER_EXPRESSION_QUERY);
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
        let [pluginMemberExpression] = match(astObject, PLUGIN_MEMBER_EXPRESSION_QUERY);
        if (pluginMemberExpression) {
            return pluginMemberExpression && plugins.find(plugin => plugin.instanceName === pluginMemberExpression.object.name);
        }
    }

    function _selectorParser (interaction, astObject) {
        let [selectorCallExpression] = match(astObject, ELEMENT_GROUP_SELECTOR_QUERY);
        if (selectorCallExpression) {
            let [argument] = selectorCallExpression.arguments;
            return actionArgumentParserService.parse(interaction, ELEMENT_GROUP_SELECTOR_ARGUMENT, argument);    
        }
    }
}

PageObjectsModule.service('interactionParserService', InteractionParserService);
