// Module:
import { PageObjectsModule } from '../page-objects.module';

// Dependencies:
import { match, parse } from 'esquery';
import '../deprecated/action-parser.service';
import '../models/action';
import './interaction-parser.service';

// Queries:
const ACTION_FUNCTION_QUERY = parse('FunctionExpression[params]');
const INTERACTION_QUERY = parse('FunctionExpression > BlockStatement > ExpressionStatement[expression.left.name="result"]');

function ActionParserService (
    ActionModel,
    ValueModel,
    astCompareService,
    deprecatedActionParserService,
    interactionParserService
) {
    return { parse };

    function parse (pageObject, astObject, meta = {}) {
        let action = new ActionModel(pageObject);
        action.name = meta.name;

        let [actionFunction] = match(astObject, ACTION_FUNCTION_QUERY);
        actionFunction.params.forEach(param => {
            let parameterMeta = meta.parameters[action.parameters.length];
            let parameter = new ValueModel(parameterMeta);
            if (!parameterMeta) {
                parameter.isUnparseable = param;
            }
            action.parameters.push(parameter);
        });

        let interactions = match(astObject, INTERACTION_QUERY);
        if (interactions.length) {
            interactions.forEach(interactionASTObject => {
                let interaction = interactionParserService.parse(action, interactionASTObject);
                action.interactions.push(interaction);
            });
        }

        // Here we return if we parsed correctly, otherwise attempt to use the
        // deprecatedActionParserService.
        //
        // If the deprecatedActionParserService also fails, the action will be marked
        // as unparseable.
        let parsedCorrectly = astCompareService.compare(astObject, action.ast);
        if (parsedCorrectly) {
            return action;
        }

        return deprecatedActionParserService.parse(pageObject, astObject, meta);
    }
}

PageObjectsModule.service('actionParserService', ActionParserService);
