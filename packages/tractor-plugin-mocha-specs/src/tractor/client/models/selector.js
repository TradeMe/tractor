// Module:
import { MochaSpecsModule } from '../mocha-specs.module';

function createSelectorModelConstructor (
    astCreatorService
) {
    return class SelectorModel {
        constructor (step, parentElementType) {
            this.step = step;
            this.parentElementType = parentElementType;

            this._elementGroup = null;
            this._type = null;

            [this.elementGroup] = this.parentElementType.elementGroups;
            this.value = '';
        }

        get elementGroup () {
            return this._elementGroup;
        }

        set elementGroup (newElementGroup) {
            this._elementGroup = newElementGroup;
            this._type = this.step.test.spec.availablePageObjects.find(pageObject => {
                return pageObject.name === this.elementGroup.type;
            });
            this.step.elementType = this.type;
        }

        get type () {
            return this._type;
        }

        get ast () {
            return this.isUnparseable || this._toAST();
        }

        _toAST () {
            const ast = astCreatorService;

            const elementGroup = this.elementGroup.ast;
            const selector = ast.literal(this.value);

            const template = `
                element = element.<%= elementGroup %>(%= selector %);
            `;

            return ast.template(template, { elementGroup, selector });
        }
    };
}

MochaSpecsModule.factory('SelectorModel', createSelectorModelConstructor);
