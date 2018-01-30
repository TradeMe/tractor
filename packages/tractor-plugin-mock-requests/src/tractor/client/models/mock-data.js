// Module:
import { MockRequestsModule } from '../mock-requests.module';

var createMockRequestConstructor = function () {
    var MockDataModel = function MockDataModel (json, options) {
        json = json || '{}';

        this.name = '';

        Object.defineProperties(this, {
            isSaved: {
                get: function () {
                    return !!(options && options.isSaved);
                }
            },
            file: {
                get: function () {
                    return options && options.file;
                }
            },
            json: {
                get: function () {
                    var formatted;
                    try {
                        formatted = JSON.stringify(JSON.parse(json), null, '    ');
                    } catch (e) {
                        formatted = json;
                    }
                    return formatted;
                },
                set: function (newVal) {
                    json = newVal;
                }
            },
            data: {
                get: function () {
                    return this.json;
                }
            }
        });
    };

    return MockDataModel;
};

MockRequestsModule.factory('MockDataModel', createMockRequestConstructor);
