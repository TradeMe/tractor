// Utilities:
import assert from 'assert';

// Module:
import { PageObjectsModule } from '../page-objects.module';

// Dependencies:
import '../models/action';
import './interaction-parser.service';
import './parameter-parser.service';

function ActionParserService (
    ActionModel,
    interactionParserService,
    parameterParserService
) {
    return { parse };

    function parse (pageObject, astObject, meta) {
        let action = new ActionModel(pageObject);

        let actionFunctionExpression = astObject.expression.right;
        let actionBody = actionFunctionExpression.body.body;

        actionFunctionExpression.params.forEach(() => {
            let parameter = parameterParserService.parse(action);
            assert(parameter);
            parameter.name = meta.parameters[action.parameters.length].name;
            action.parameters.push(parameter);
        });

        actionBody.forEach((statement, index) => {
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
                    interactionParserService.parse(action, statement);
                }
            } catch (e) {
                notInteraction = true;
            }

            if (notSelf && notInteraction) {
                // eslint-disable-next-line no-console
                console.log(statement, index);
            }
        });

        return action;
    }
}

PageObjectsModule.service('actionParserService', ActionParserService);
