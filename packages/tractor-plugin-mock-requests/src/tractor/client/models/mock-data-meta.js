// Utilities:
import { pascal } from 'change-case';

// Module:
import { MockRequestsModule } from '../mock-requests.module';

function createMockDataMetaModelConstructor () {
    let MockDataMetaModel = function MockDataMetaModel (mockRequest) {
        Object.defineProperties(this, {
            name: {
                get () {
                    return mockRequest.basename;
                }
            },
            variableName: {
                get () {
                    return pascal(this.name);
                }
            },
            url: {
                get () {
                    return mockRequest.url;
                }
            },
            comment: {
                get () {
                    return toComment.call(this);
                }
            }
        });
    }

    MockDataMetaModel.prototype.actions = ['GET', 'POST', 'DELETE', 'PUT', 'HEAD', 'PATCH'];

    return MockDataMetaModel;

    function toComment () {
        return {
            name: this.name
        };
    }
}

MockRequestsModule.factory('MockDataMetaModel', createMockDataMetaModelConstructor);
