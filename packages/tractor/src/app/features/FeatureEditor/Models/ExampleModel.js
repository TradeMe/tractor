'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var FeatureEditor = require('../FeatureEditor');

// Dependencies:
require('../../../Core/Services/StringToLiteralService');

var createExampleModelConstructor = function (
    stringToLiteralService,
    FeatureIndent
) {
    var ExampleModel = function ExampleModel (scenario) {
        var values = {};

        Object.defineProperties(this, {
            scenario: {
                get: function () {
                    return scenario;
                }
            },
            values: {
                get: function () {
                    _.each(this.scenario.exampleVariables, function (exampleVariable) {
                        values[exampleVariable] = values[exampleVariable] || {
                            value: ''
                        };
                    });
                    return values;
                }
            },
            feature: {
                get: function () {
                    return toFeature.call(this);
                }
            }
        });
    };

    return ExampleModel;

    function toFeature () {
        var values = '| ' + _.map(this.scenario.exampleVariables, function (variable) {
           var value = this.values[variable].value;
           var literal = stringToLiteralService.toLiteral(value);
           return !_.isUndefined(literal) ? literal : '"' + value + '"';
        }, this).join(' | ') + ' |';
        return FeatureIndent + FeatureIndent + FeatureIndent + values;
    }
};

FeatureEditor.factory('ExampleModel', function (
    stringToLiteralService,
    FeatureIndent
) {
    return createExampleModelConstructor(stringToLiteralService, FeatureIndent);
});
