// Module:
import { MochaSpecsModule } from '../mocha-specs.module';

function createStepArgumentModelConstructor (
    astCreatorService,
    stringToLiteralService
) {
    return class StepArgumentModel {
        constructor (argument) {
            this.name = argument.name;

            // Don't think `argumnet.required` is ever set, but might be?
            // Should default to true any way, unless we add optional args:
            this.required = argument.required != null ? argument.required : true;
            this.value = '';
        }

        get ast () {
            return this.isUnparseable || this._toAST();
        }

        _toAST () {
            let ast = astCreatorService;

            let literal = stringToLiteralService.toLiteral(this.value);

            if (literal !== undefined && literal !== this.value) {
                return ast.literal(literal);
            } else if (this.value) {
                return ast.literal(this.value);
            } else {
                return ast.literal(null);
            }
        }
    };
}

MochaSpecsModule.factory('StepArgumentModel', createStepArgumentModelConstructor);
