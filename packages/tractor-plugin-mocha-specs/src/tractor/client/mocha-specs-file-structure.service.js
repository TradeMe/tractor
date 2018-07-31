// Module:
import { MochaSpecsModule } from './mocha-specs.module';

MochaSpecsModule.factory('mochaSpecsFileStructureService', fileStructureServiceFactory => {
    return fileStructureServiceFactory('mocha-specs');
});
