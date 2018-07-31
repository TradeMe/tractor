// Module:
import { MochaSpecsModule } from '../mocha-specs.module';

function createHeaderModelConstructor () {
    return class HeaderModel {
        constructor (mock) {
            this.mock = mock;

            this.key = '';
            this.value = '';
        }

        get ast () {
            return this.isUnparseable || this._toAST();
        }

        _toAST () {
            return `"${this.key.replace(/"/, '\\"')}": "${this.value.replace(/"/, '\\"')}"`;
        }
    };
}

MochaSpecsModule.factory('HeaderModel', createHeaderModelConstructor);
