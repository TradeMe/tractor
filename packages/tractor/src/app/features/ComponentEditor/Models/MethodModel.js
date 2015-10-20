'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var ComponentEditor = require('../ComponentEditor');

// Dependencies:
require('./ArgumentModel');

var createMethodModelConstructor = function (
    ArgumentModel
) {
    var MethodModel = function MethodModel (interaction, method) {
        this.arguments = getArguments.call(this, method);

        Object.defineProperties(this, {
            interaction: {
                get: function () {
                    return interaction;
                }
            },
            name: {
                get: function () {
                    return method.name;
                }
            },
            description: {
                get: function () {
                    return method.description;
                }
            },
            returns: {
                get: function () {
                    return method.returns;
                }
            }
        });

        if (this.returns) {
            this[this.returns] = method[this.returns];
        }
    };

    return MethodModel;

    function getArguments (method) {
        return _.map(method.arguments, function (argument) {
            return new ArgumentModel(this, argument);
        }, this);
    }
};

ComponentEditor.factory('MethodModel', function (
    ArgumentModel
) {
    return createMethodModelConstructor(ArgumentModel);
});
