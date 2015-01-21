'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var ComponentEditor = require('../ComponentEditor');

// Dependencies:
require('../../../Core/Services/ASTCreatorService');

var ParameterModel = function (ASTCreatorService) {
    var ast = ASTCreatorService;

    var DEFAULTS = {
        name: 'parameter'
    };

    var ParameterModel = function ParameterModel (action) {
        Object.defineProperties(this, {
            action: {
                get: function () { return action; }
            },
            name: {
                get: function () { return this.nameIdentifier.name; },
                set: function (name) { this.nameIdentifier.name = name; }
            },
            ast: {
                get: function () { return toAST.call(this); }
            }
        });

        this.nameIdentifier = ast.createIdentifier(this.validateName(this, DEFAULTS.name));
    };

    ParameterModel.prototype.validateName = function (parameter, name) {
        var nameToCheck = name;
        var names = getAllNames.call(this, parameter);
        var count = 1;
        while (_.contains(names, nameToCheck)) {
            nameToCheck = name + count;
            count += 1;
        }
        return nameToCheck;
    };

    var getAllNames = function (reject) {
        return _.chain(this.action.parameters)
        .reject(function (object) {
            return object === reject;
        }).map(function (object) {
            return object.name;
        }).value();
    };

    var toAST = function () {
        return this.nameIdentifier;
    };

    return ParameterModel;
};


ComponentEditor.factory('ParameterModel', function (ASTCreatorService) {
    return ParameterModel(ASTCreatorService);
});
