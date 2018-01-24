// Module:
import { PageObjectsModule } from '../page-objects.module';

// Queries:
const ACTION_FUNCTION_QUERY = 'FunctionExpression[params]';
const INTERACTION_QUERY = 'FunctionExpression > BlockStatement > ReturnStatement';

// Dependencies:
import esquery from 'esquery';
import '../models/action';
import '../models/value';
import './interaction-parser.service';

function DeprecatedActionParserService (
    ActionModel,
    ValueModel,
    astCompareService,
    deprecatedInteractionParserService
) {
    return { parse };

    function parse (pageObject, astObject, meta) {
        let action = new ActionModel(pageObject);
        action.name = meta.name;

        let [actionFunction] = esquery(astObject, ACTION_FUNCTION_QUERY);
        actionFunction.params.forEach(param => {
            let parameterMeta = meta.parameters[action.parameters.length];
            let parameter = new ValueModel(parameterMeta);
            if (!parameterMeta) {
                parameter.unparseable = param;
            }
            action.parameters.push(parameter);
        });

        let [interaction] = esquery(astObject, INTERACTION_QUERY);
        deprecatedInteractionParserService.parse(action, interaction);

        let parsedCorrectly = astCompareService.compare(astObject, action.ast);
        if (!parsedCorrectly) {
            action.unparseable = astObject;
        }

        return action;
    }
}

PageObjectsModule.service('deprecatedActionParserService', DeprecatedActionParserService);
