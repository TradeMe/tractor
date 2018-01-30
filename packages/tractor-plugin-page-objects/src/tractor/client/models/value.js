// Module:
import { PageObjectsModule } from '../page-objects.module';

// Dependencies:
import camelcase from 'camel-case';

function createValueModelConstructor (
    astCreatorService
) {
    return class ValueModel {
        constructor (value = {}) {
            let { description, name, required, resolves, type } = value;

            this.description = description;
            this.name = name;
            this.required = required;
            this.resolves = resolves;
            this.type = type;
        }

        get ast () {
            return this.isUnparseable || this._toAST();
        }

        get meta () {
            return this.name ? this._toMeta() : null;
        }

        get variableName () {
            return camelcase(this.name);
        }

        _toAST () {
            let ast = astCreatorService;
            return ast.identifier(this.variableName);
        }

        _toMeta () {
            return {
                description: this.description,
                name: this.name,
                required: this.required,
                resolves: this.resolves,
                type: this.type
            };
        }
    }
}

PageObjectsModule.factory('ValueModel', createValueModelConstructor);
