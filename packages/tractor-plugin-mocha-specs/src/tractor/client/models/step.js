// Module:
import { MochaSpecsModule } from '../mocha-specs.module';

// Dependencies:
import './selector';
import './step-argument';

function createStepModelConstructor (
    SelectorModel,
    StepArgumentModel
) {
    return class StepModel {
        constructor (test) {
            this.test = test;

            this._action = null;
            this._arguments = null;
            this._elementType = null;
            this._pageObject = null;

            this.selectors = [];
        }

        get ast () {
            return this.isUnparseable;
        }

        get pageObject () {
            return this._pageObject;
        }

        set pageObject (newPageObject) {
            if (newPageObject) {
                this._pageObject = newPageObject;
                this.selectors = [];
                [this.action] = this.pageObject.actions;    
            }
        }

        get action () {
            return this._action;
        }

        set action (newAction) {
            if (newAction) {
                this._action = newAction;
                this.arguments = this._parseArguments();    
            }
        }

        get arguments () {
            return this._arguments;
        }

        set arguments (newArguments) {
            if (newArguments) {
                this._arguments = newArguments;
            }
        }

        get elementType () {
            return this._elementType || this.pageObject;
        }

        set elementType (newElementType) {
            if (newElementType) {
                this._elementType = newElementType;
                const lastSelectorIndex = this.selectors.findIndex(selector => selector.type === this.elementType);
                if (lastSelectorIndex >= 0 && lastSelectorIndex < this.selectors.length) {
                    this.selectors.length = lastSelectorIndex + 1;
                }
                [this.action] = this.elementType.actions;    
            }
        }

        addSelector () {
            const lastSelector = this.selectors[this.selectors.length - 1];
            this.selectors.push(new SelectorModel(this, lastSelector && lastSelector.type || this.pageObject));
        }

        removeSelector (selector) {
            this.selectors.length = this.selectors.indexOf(selector);
            const lastSelector = this.selectors[this.selectors.length - 1];
            this.elementType = lastSelector && lastSelector.type || null;
        }

        _parseArguments () {
            return this.action.parameters.map(parameter => {
                return new StepArgumentModel(parameter);
            });
        }
    };
}

MochaSpecsModule.factory('SpecStepModel', createStepModelConstructor);
