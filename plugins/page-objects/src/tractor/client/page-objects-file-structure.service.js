// Module:
import { PageObjectsModule } from './page-objects.module';

PageObjectsModule.factory('pageObjectFileStructureService', fileStructureServiceFactory => {
    return fileStructureServiceFactory('page-objects');
});
