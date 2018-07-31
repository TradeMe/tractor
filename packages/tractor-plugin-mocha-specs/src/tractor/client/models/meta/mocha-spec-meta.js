// Module:
import { MochaSpecsModule } from '../../mocha-specs.module';

function createMochaSpecMetaModelConstructor () {
    return class MochaSpecMetaModel {
        constructor (mochaSpec) {
            let { meta, path } = mochaSpec;

            this.name = meta.name;
            this.path = path;
        }
    };
}

MochaSpecsModule.factory('MochaSpecMetaModel', createMochaSpecMetaModelConstructor);
