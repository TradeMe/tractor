// Module:
import { PageObjectsModule } from '../page-objects.module';

// Queries:
const ACTION_FUNCTION_QUERY = 'FunctionExpression[params]';
const INTERACTION_QUERY = 'FunctionExpression > BlockStatement > ExpressionStatement > AssignmentExpression[left.name="result"]';

// Dependencies:
import assert from 'assert';
import esquery from 'esquery';
import '../deprecated/action-parser.service';
import '../models/action';
import './interaction-parser.service';

function ActionParserService (
    ActionModel,
    ValueModel,
    deprecatedActionParserService,
    interactionParserService
) {
    return { parse };

    function parse (pageObject, astObject, meta) {
        let action = new ActionModel(pageObject);
        action.name = meta.name;

        let [actionFunction] = esquery(astObject, ACTION_FUNCTION_QUERY);
        actionFunction.params.forEach(param => {
            let parameterMeta = meta.parameters[action.parameters.length];
            assert(parameterMeta.name, `
                Could not find meta-data for parameter "${param.name}" of action "${action.name}".
            `);
            let parameter = new ValueModel(parameterMeta);
            action.parameters.push(parameter);
        });

        let interactions = esquery(astObject, INTERACTION_QUERY);
        if (interactions.length) {
            interactions.forEach(interactionASTObject => {
                let interaction = interactionParserService.parse(action, interactionASTObject);
                action.interactions.push(interaction);
            });
            return action;
        }

        return deprecatedActionParserService.parse(pageObject, astObject, meta);
    }
}

PageObjectsModule.service('actionParserService', ActionParserService);
