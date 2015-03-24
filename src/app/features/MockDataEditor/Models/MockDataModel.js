'use strict';

// Module:
var MockDataEditor = require('../MockDataEditor');

var createMockDataModelConstructor = function () {
    var MockDataModel = function MockDataModel (json, options) {
        json = json || '""';

        this.isSaved = !!(options && options.isSaved);
        this.name = '';

        Object.defineProperties(this, {
            json: {
                get: function () {
                    var formatted;
                    try {
                        formatted = JSON.stringify(JSON.parse(json), null, 4);
                    } catch (e) {
                        formatted = json;
                    }
                    return formatted;
                },
                set: function (newVal) {
                    json = newVal;
                }
            }
        });
    };

    return MockDataModel;
};

MockDataEditor.factory('MockDataModel', function () {
    return createMockDataModelConstructor();
});
