// Module:
import { PageObjectsModule } from '../page-objects.module';

// Dependencies:
import { ELEMENT_GROUP_SELECTOR_ARGUMENT } from './meta/element-group-selector-argument';
import './action-instance';
import './action-argument';

function createInteractionModelConstructor (
    astCreatorService,
    ActionInstanceModel,
    ActionArgumentModel
) {
    let ast = astCreatorService;

    return class InteractionModel {
        constructor (containingAction, previousInteraction) {
            // This is very awkwardly named:
            this.containingAction = containingAction;
            this.previousInteraction = previousInteraction;

            this.element = this.containingAction.pageObject.browser;
            this.selector = new ActionArgumentModel(this, ELEMENT_GROUP_SELECTOR_ARGUMENT);
        }

        get element () {
            return this._element;
        }

        set element (newElement) {
            this._element = newElement;
            [this.action] = newElement.actions;
        }

        get action () {
            return this._action;
        }

        set action (newAction) {
            if (!newAction) {
                [newAction] = this.element.actions;
            }
            this._action = newAction;
            this._actionInstance = new ActionInstanceModel(this, newAction);
        }

        get actionInstance () {
            return this._actionInstance;
        }

        get ast () {
            return this.isUnparseable || this._toAST();
        }

        _toAST () {
            let previousResult = this._getPreviousInteractionResult();

            let template;
            if (previousResult) {
                template = `
                    result = result.then(function (%= previousResult %) {
                        return <%= interaction %>;
                    });
                `;
            } else {
                template = `
                    result = result.then(function () {
                        return <%= interaction %>;
                    });
                `;
            }

            let interaction = this._interactionAST();
            previousResult = previousResult ? ast.identifier(previousResult) : null;

            return ast.template(template, { interaction, previousResult });
        }

        _interactionAST () {
            let template = !this.element.pageObject ? '<%= plugin %>' : 'self.<%= element %>';

            if (this.element.group) {
                template += '(<%= selector %>)';
            }
            template += '.<%= action %>(%= argumentValues %)';

            if (this.isOptional) {
                template += '.catch(function () {})';
            }
            template += '';

            let action = ast.identifier(this.actionInstance.variableName);
            let argumentValues = this.actionInstance.arguments.map(argument => argument.ast);
            let element = ast.identifier(this.element.variableName);
            let plugin = ast.identifier(this.element.instanceName);
            let selector = this.selector.ast;

            return ast.expression(template, {
                action,
                argumentValues,
                element,
                plugin,
                selector
            });
        }

        _getPreviousInteractionResult () {
            let previous = this.previousInteraction;
            let returns = previous && previous.action && previous.action.returns;
            return returns && returns.variableName;
        }
    };
}

PageObjectsModule.factory('InteractionModel', createInteractionModelConstructor);
