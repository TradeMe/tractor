// Module:
import { PageObjectsModule } from '../page-objects.module';

// Dependencies:
import assert from 'assert';
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
        action.isDeprecated = true;
        action.name = meta.name;

        let actionFunctionExpression = astObject.right;
        let actionBody = actionFunctionExpression.body.body;

        actionFunctionExpression.params.forEach(param => {
            let parameterMeta = meta.parameters[action.parameters.length];
            let parameter = new ValueModel(parameterMeta);
            if (!parameterMeta) {
                parameter.isUnparseable = param;
            }
            action.parameters.push(parameter);
        });

        actionBody.forEach((statement) => {
            let notSelf = false;
            let notInteraction = false;

            try {
                let [selfVariableDeclarator] = statement.declarations;
                assert(selfVariableDeclarator.id.name === 'self');
            } catch (e) {
                notSelf = true;
            }

            try {
                if (notSelf) {
                    deprecatedInteractionParserService.parse(action, statement);
                }
            } catch (e) {
                notInteraction = true;
            }

            if (notSelf && notInteraction) {
                action.isUnparseable = astObject;
            }
        });

        let parsedCorrectly = astCompareService.compare(astObject, action.ast);
        if (!parsedCorrectly) {
            action.isUnparseable = astObject;
        }

        return action;
    }
}

PageObjectsModule.service('deprecatedActionParserService', DeprecatedActionParserService);
