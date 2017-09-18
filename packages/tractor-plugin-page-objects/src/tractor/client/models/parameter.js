// Utilities:
import camelcase from 'camel-case';

// Module:
import { PageObjectsModule } from '../page-objects.module';

function createParameterModelConstructor (
    astCreatorService
) {
    let ParameterModel = function ParameterModel (action) {
        Object.defineProperties(this, {
            action: {
                get () {
                    return action;
                }
            },
            variableName: {
                get () {
                    return camelcase(this.name);
                }
            },
            meta: {
                get () {
                    return {
                        name: this.name
                    };
                }
            },
            ast: {
                get () {
                    return toAST.call(this);
                }
            }
        });

        this.name = '';
    };

    ParameterModel.prototype.getAllVariableNames = function () {
        let currentParameter = this;
        return this.action.parameters.filter(parameter => parameter !== currentParameter)
        .map(parameter => parameter.name)
        .filter(Boolean);
    };

    return ParameterModel;

    function toAST () {
        let ast = astCreatorService;
        return ast.identifier(this.variableName);
    }
}

PageObjectsModule.factory('ParameterModel', createParameterModelConstructor);
