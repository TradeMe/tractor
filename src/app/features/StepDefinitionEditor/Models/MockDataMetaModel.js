'use strict';

// Utilities:
var path = require('path');

// Module:
var StepDefinitionEditor = require('../StepDefinitionEditor');

// Depenedencies:
var pascal = require('change-case').pascal;

var createMockDataMetaModelConstructor = function () {
    var MockDataMetaModel = function MockDataMetaModel (mockData) {
        Object.defineProperties(this, {
            name: {
                get: function () {
                    return mockData.meta.name;
                }
            },
            variableName: {
                get: function () {
                    return pascal(this.name);
                }
            },
            url: {
                get: function () {
                    return mockData.url;
                }
            }
        });
    };

    return MockDataMetaModel;
};

StepDefinitionEditor.factory('MockDataMetaModel', function () {
    return createMockDataMetaModelConstructor();
});
