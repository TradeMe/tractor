'use strict';

// Utilities:
var _ = require('lodash');
var toLiteral = require('../../../utilities/toLiteral');

// Module:
var GherkinEditor = require('../GherkinEditor');

var createExampleModelConstructor = function (GherkinIndent) {
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
           var literal = toLiteral(value);
           return !_.isUndefined(literal) ? literal : '"' + value + '"';
        }, this).join(' | ') + ' |';
        return GherkinIndent + GherkinIndent + GherkinIndent + values;
    }
};

GherkinEditor.factory('ExampleModel', function (GherkinIndent) {
    return createExampleModelConstructor(GherkinIndent);
});
