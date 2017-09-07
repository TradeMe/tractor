// Module:
import { MockRequestsModule } from './mock-requests.module';

MockRequestsModule.factory('mockRequestFileStructureService', fileStructureServiceFactory => {
    return fileStructureServiceFactory('mock-requests');
});
