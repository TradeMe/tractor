// Module:
import { MochaSpecsModule } from '../mocha-specs.module';

// Dependencies:
import './step';

function createInteractionModelConstructor (
    SpecStepModel,
    astCreatorService
) {
    return class InteractionModel extends SpecStepModel {
        constructor (test) {
            super(test);
            this.isInteraction = true;

            [this.pageObject] = this.test.spec.availablePageObjects;
        }

        get ast () {
            return this.isUnparseable || this._toAST();
        }

        _toAST () {
            let ast = astCreatorService;

            let action = ast.identifier(this.action.variableName);
            let pageObject = ast.identifier(this.pageObject.instanceName);
            let selectors = this.selectors.map(selector => selector.ast);
            let taskArguments = this.arguments.map(argument => argument.ast);

            let template = `
                step = step.then(function () {
                    var element;
                    element = <%= pageObject %>;
                    %= selectors %;
                    return element.<%= action %>(%= taskArguments %)
                });
            `;

            return ast.template(template, { action, pageObject, selectors, taskArguments });
        }
    };
}

MochaSpecsModule.factory('SpecInteractionModel', createInteractionModelConstructor);
