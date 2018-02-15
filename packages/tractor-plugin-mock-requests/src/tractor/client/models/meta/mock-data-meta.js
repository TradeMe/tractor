// Module:
import { MockRequestsModule } from '../../mock-requests.module';

// Dependencies:
import pascalcase from 'pascal-case';

// Constants:
const ACTIONS = ['GET', 'POST', 'DELETE', 'PUT', 'HEAD', 'PATCH'];

function createMockDataMetaModelConstructor () {
    return class MockDataMetaModel {
        constructor (mockRequest) {
            let { basename, path } = mockRequest;

            this.name = basename;
            this.path = path;
            this.variableName = pascalcase(this.name);

            this.actions = ACTIONS
        }
    }
}

MockRequestsModule.factory('MockDataMetaModel', createMockDataMetaModelConstructor);
