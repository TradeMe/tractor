// Module:
import { PageObjectsModule } from '../page-objects.module';

// Queries:
const ACTION_FUNCTION_QUERY = 'FunctionExpression[params]';
const INTERACTION_QUERY = 'FunctionExpression > BlockStatement > ReturnStatement';

// Dependencies:
import assert from 'assert';
import esquery from 'esquery';
import '../models/action';
import '../models/value';
import './interaction-parser.service';

function DeprecatedActionParserService (
    ActionModel,
    ValueModel,
    deprecatedInteractionParserService
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

        let [interaction] = esquery(astObject, INTERACTION_QUERY);
        assert(interaction, `
            Could not find interaction for action "${action.name}".
        `);
        deprecatedInteractionParserService.parse(action, interaction);

        return action;
    }
}

PageObjectsModule.service('deprecatedActionParserService', DeprecatedActionParserService);
