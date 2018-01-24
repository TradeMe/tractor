// Module:
import { PageObjectsModule } from '../page-objects.module';

// Dependencies:
import camelcase from 'camel-case';

function createActionArgumentModelConstructor (
    astCreatorService,
    stringToLiteralService
) {
    return class ActionArgumentModel {
        constructor (interaction, argument) {
            this.interaction = interaction;

            let { description, name, required, type } = argument;

            this.description = description;
            this.name = name;
            this.required = required;
            this.type = type;

            this.value = '';
        }

        get ast () {
            return this.unparseable || this._toAST();
        }

        get variableName () {
            return camelcase(this.name);
        }

        _toAST () {
            let ast = astCreatorService;

            let literal = stringToLiteralService.toLiteral(this.value);
            let parameter = this._findParameter();
            let result = this._findResult();
            let element = this._findElement();

            if (literal !== undefined && literal !== this.value) {
                return ast.literal(literal);

            // The following ordering matters to the variable scoping
            // of the generated JS.

            // Try to find a matching parameter first:
            } else if (parameter) {
                return ast.identifier(parameter.variableName);
            // A result could have the same name as a parameter, but could
            // exist in a wrapping scope, so we check that next:
            } else if (result) {
                return ast.identifier(result.variableName);
            // An element could have the same name as a parameter or a result
            // but would be in a scope even further up, so we check that last:
            } else if (element) {
                return ast.memberExpression(ast.identifier('self'), ast.identifier(element.variableName));

            } else if (this.value) {
                return ast.literal(this.value);
            } else {
                return ast.literal(null);
            }
        }

        _findElement () {
            return this.interaction.containingAction.pageObject.domElements.find(element => {
                return element.name === this.value;
            });
        }

        _findParameter () {
            return this.interaction.containingAction.parameters.find(parameter => {
                return parameter.name === this.value;
            });
        }

        _findResult () {
            let { previousInteraction } = this.interaction;
            if (!previousInteraction) {
                return null;
            }
            let { returns } = this.interaction.previousInteraction.action;
            if (!returns) {
                return null;
            }
            return returns.name === this.value ? returns : null;
        }
    }
}

PageObjectsModule.factory('ActionArgumentModel', createActionArgumentModelConstructor);
