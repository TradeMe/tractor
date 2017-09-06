// Module:
import { PageObjectsModule } from '../page-objects.module';

// Dependencies:
import './method';

function createInteractionModelConstructor (
    astCreatorService,
    MethodModel
) {
    let ast = astCreatorService;

    let InteractionModel = function InteractionModel (action) {
        let element;
        let method;
        let methodInstance;

        Object.defineProperties(this, {
            action: {
                get () {
                    return action;
                }
            },
            element: {
                get () {
                    return element;
                },
                set (newElement) {
                    element = newElement;
                    [this.method] = element.methods;
                }
            },
            method: {
                get () {
                    return method;
                },
                set (newMethod) {
                    method = newMethod;
                    methodInstance = new MethodModel(this, this.method);
                }
            },
            methodInstance: {
                get () {
                    return methodInstance;
                }
            },
            arguments: {
                get () {
                    return methodInstance.arguments;
                }
            },
            ast: {
                get () {
                    return toAST.call(this);
                }
            }
        });
    };

    return InteractionModel;

    function toAST () {
        this.resultFunctionExpression = ast.functionExpression();

        let template = '<%= interaction %>';
        if (this.methodInstance.returns !== 'promise') {
            template = 'new Promise(function (resolve) { resolve(' + template + '); });';
        }

        let interaction = interactionAST.call(this);

        return ast.expression(template, { interaction });
    }

    function interactionAST () {
        let template = '<%= element %>';
        if (!isPlugin(this.element)) {
            template = 'self.' + template;
        }
        template += '.<%= method %>(%= argumentValues %);';

        let element = ast.identifier(this.element.variableName);
        let method = ast.identifier(this.methodInstance.name);
        let argumentValues = this.methodInstance.arguments.map(argument => argument.ast);

        return ast.expression(template, {
            element,
            method,
            argumentValues
        });
    }

    function isPlugin (element) {
        return !element.pageObject;
    }
}

PageObjectsModule.factory('InteractionModel', createInteractionModelConstructor);
