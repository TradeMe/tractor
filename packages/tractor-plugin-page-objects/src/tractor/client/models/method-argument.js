// Module:
import { PageObjectsModule } from '../page-objects.module';

function createMethodArgumentModelConstructor (
    astCreatorService,
    stringToLiteralService
) {
    let MethodArgumentModel = function MethodArgumentModel (method, argument) {
        Object.defineProperties(this, {
            method: {
                get () {
                    return method || null;
                }
            },
            name: {
                get () {
                    return argument ? argument.name : false;
                }
            },
            description: {
                get () {
                    return argument ? argument.description : false;
                }
            },
            type: {
                get () {
                    return argument ? argument.type : false;
                }
            },
            required: {
                get () {
                    return argument ? !!argument.required : false;
                }
            },
            ast: {
                get () {
                    return toAST.call(this);
                }
            }
        });

        this.value = '';
    };

    return MethodArgumentModel;

    function toAST () {
        let ast = astCreatorService;

        let literal = stringToLiteralService.toLiteral(this.value);
        let parameter = findParameter.call(this);
        let result = findResult.call(this);
        let element = findElement.call(this);

        if (literal !== undefined && literal !== this.value) {
            return ast.literal(literal);

        // The following ordering matters to the variable scoping
        // of the generated JS.

        // Try to find a matching parameter first:
        } else if (parameter) {
            return ast.identifier(parameter.variableName);
        // A result could have the same name as a parameter, but would
        // exist in a wrapping scope, so we check that next:
        } else if (result) {
            return ast.identifier(this.value);
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

    function findElement () {
        return this.method && this.method.interaction.action.pageObject.domElements.find(element => {
            return element.name === this.value;
        });
    }

    function findParameter () {
        return this.method && this.method.interaction.action.parameters.find(parameter => {
            return parameter.name === this.value;
        });
    }

    function findResult () {
        return this.method && this.method.interaction.action.interactions.find(interaction => {
            var returns = interaction.method[interaction.method.returns];
            return returns ? returns.name === this.value : false;
        });
    }
}

PageObjectsModule.factory('MethodArgumentModel', createMethodArgumentModelConstructor);
