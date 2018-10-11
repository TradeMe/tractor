// Module:
import { MochaSpecsModule } from '../mocha-specs.module';

function createSelectorModelConstructor (
    astCreatorService
) {
    return class SelectorModel {
        constructor (step, parentElement) {
            this.step = step;
            this.parentElement = parentElement;

            this._element = null;
            this._group = false;
            this._type = null;

            [this.element] = this.parentElement.elementsWithType;
            this.value = '';
        }

        get element () {
            return this._element;
        }

        set element (newElement) {
            if (newElement) {
                this._element = newElement;
                this._group = this.parentElement.elementGroups.includes(this.element);
                this._type = this.step.test.spec.availablePageObjects.find(pageObject => {
                    return pageObject.name === this.element.type;
                });
                this.step.elementType = this.type;
            }
        }

        get group () {
            return this._group;
        }

        get type () {
            return this._type;
        }

        get ast () {
            return this.isUnparseable || this._toAST();
        }

        _toAST () {
            const ast = astCreatorService;

            const element = this.element.ast;
            const selector = ast.literal(this.value);

            let template;
            if (this.group) {
                template = `
                    element = element.<%= element %>(%= selector %);
                `;
            } else {
                template = `
                    element = element.<%= element %>;
                `;
            }

            return ast.template(template, { element, selector });
        }
    };
}

MochaSpecsModule.factory('SelectorModel', createSelectorModelConstructor);
