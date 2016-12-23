'use strict';

// Utilities:
var path = require('path');

// Module:
var StepDefinitionEditor = require('../StepDefinitionEditor');

// Depenedencies:
var pascal = require('change-case').pascal;
require('./ActionMetaModel');

var createComponentMetaModelConstructor = function (
    ActionMetaModel
) {
    var ComponentMetaModel = function ComponentMetaModel (component) {
        var actions = component.meta.actions.map(function (action) {
            return new ActionMetaModel(action);
        });

        Object.defineProperties(this, {
            actions: {
                get: function () {
                    return actions;
                }
            },
            name: {
                get: function () {
                    return component.meta.name;
                }
            },
            variableName: {
                get: function () {
                    return pascal(this.name);
                }
            },
            url: {
                get: function () {
                    return component.url;
                }
            }
        });
    };

    return ComponentMetaModel;
};

StepDefinitionEditor.factory('ComponentMetaModel', function (
    ActionMetaModel
) {
    return createComponentMetaModelConstructor(ActionMetaModel);
});
