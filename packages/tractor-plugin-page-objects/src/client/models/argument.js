// Module:
import { PageObjectsModule } from '../page-objects.module';

function createArgumentModelConstructor (
    astCreatorService,
    stringToLiteralService
) {
    let ArgumentModel = function ArgumentModel (method, argument) {
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

    return ArgumentModel;

    function toAST () {
        let ast = astCreatorService;

        let literal = stringToLiteralService.toLiteral(this.value);
        let parameter = findParameter.call(this);
        let result = findResult.call(this);

        if (literal !== undefined && literal !== this.value) {
            return ast.literal(literal);
        } else if (parameter) {
            return ast.identifier(parameter.variableName);
        } else if (result) {
            return ast.identifier(this.value);
        } else if (this.value) {
            return ast.literal(this.value);
        } else {
            return ast.literal(null);
        }
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

PageObjectsModule.factory('ArgumentModel', createArgumentModelConstructor);
