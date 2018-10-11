// Module:
import { MochaSpecsModule } from '../mocha-specs.module';

// Dependencies:
import './selector';
import './step-argument';
import './step';

// Constants:
const CONDITIONS = ['equal', 'contain'];

function createAssertionModelConstructor (
    SpecStepModel,
    StepArgumentModel,
    astCreatorService
) {
    return class AssertionModel extends SpecStepModel {
        constructor (test) {
            super(test);
            this.isAssertion = true;

            this.conditions = CONDITIONS;
            [this.condition] = this.conditions;

            [this.pageObject] = this.test.spec.availablePageObjects;
            this.expectedResult = new StepArgumentModel({ name: 'Expected result' });
        }

        get ast () {
            return this.isUnparseable || this._toAST();
        }

        _toAST () {
            let ast = astCreatorService;

            let action = ast.identifier(this.action.variableName);
            let condition = ast.identifier(this.condition);
            let expectationArguments = this.arguments.map(argument => argument.ast);
            let expectedResult = this.expectedResult.ast;
            let pageObject = ast.identifier(this.pageObject.instanceName);
            let selectors = this.selectors.map(selector => selector.ast);

            let template = `
                step = step.then(function () {
                    var element;
                    element = <%= pageObject %>;
                    %= selectors %;
                    return expect(element.<%= action %>(%= expectationArguments %)).to.eventually.<%= condition %>(<%= expectedResult %>);
                });
            `;

            return ast.template(template, { action, condition, expectationArguments, expectedResult, pageObject, selectors });
        }
    };
}

MochaSpecsModule.factory('SpecAssertionModel', createAssertionModelConstructor);
