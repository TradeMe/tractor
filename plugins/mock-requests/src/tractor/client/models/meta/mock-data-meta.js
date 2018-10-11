// Module:
import { MockRequestsModule } from '../../mock-requests.module';

// Dependencies:
import camelcase from 'camel-case';

// Constants:
const ACTIONS = ['GET', 'POST', 'DELETE', 'PUT', 'HEAD', 'PATCH'];
const NUMBER_FOLLOWED_BY_LOWERCASE_LETTER_REGEX = /(\d)([a-z])/g;

function createMockDataMetaModelConstructor () {
    return class MockDataMetaModel {
        constructor (mockRequest) {
            let { basename, path } = mockRequest;

            this.name = basename;
            this.path = path;
            this.variableName = this._fixVariableName(camelcase(this.name));

            this.actions = ACTIONS;
        }

        _fixVariableName (variableName) {
            return variableName.replace(NUMBER_FOLLOWED_BY_LOWERCASE_LETTER_REGEX, (...match) => {
                const [, number, letter] = match;
                return `${number}${letter.toUpperCase()}`;
            });
        }
    };
}

MockRequestsModule.factory('MockDataMetaModel', createMockDataMetaModelConstructor);
