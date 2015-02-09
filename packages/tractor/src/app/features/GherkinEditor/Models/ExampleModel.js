'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var GherkinEditor = require('../GherkinEditor');

// Dependencies:
require('../../../Core/Services/StringToLiteralService');

var createExampleModelConstructor = function (
    StringToLiteralService,
    GherkinIndent
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
           var value = this.values[variable];
           var literal = StringToLiteralService.toLiteral(value);
           return !_.isUndefined(literal) ? literal : '"' + value + '"';
        }, this).join(' | ') + ' |';
        return GherkinIndent + GherkinIndent + GherkinIndent + values;
    }
};

GherkinEditor.factory('ExampleModel', function (GherkinIndent) {
    return createExampleModelConstructor(GherkinIndent);
});
