'use strict';

// Utilities;
var _ = require('lodash');

// Module:
var StepDefinitionEditor = require('../StepDefinitionEditor');

// Dependencies:
require('../../../Core/Services/ASTCreatorService');

var createHeaderModelConstructor = function () {
    var HeaderModel = function HeaderModel (mock) {
        Object.defineProperties(this, {
            mock: {
                get: function () {
                    return mock;
                }
            },
            ast: {
                get: function () {
                    return toAST.call(this);
                }
            }
        });

        this.key = '';
        this.value = '';
    };

    return HeaderModel;

    function toAST () {
        return '"' + this.key.replace(/"/, '\\\"') + '": ' + '"' + this.value.replace(/"/, '\\\"') + '"'
    }
};

StepDefinitionEditor.factory('HeaderModel', function () {
    return createHeaderModelConstructor();
});
