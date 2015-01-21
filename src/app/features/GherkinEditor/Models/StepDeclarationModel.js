'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var GherkinEditor = require('../GherkinEditor');

var StepDeclarationModel =  function () {
    var DEFAULTS = {
        step: 'something happens'
    };

    var StepDeclarationModel = function StepDeclarationModel () {
        Object.defineProperties(this, {
            feature: {
                get: function () { return toFeature.call(this); }
            }
        });

        this.type = _.first(this.types);
        this.step = DEFAULTS.step;
    };

    StepDeclarationModel.prototype.types = ['Given', 'When', 'Then', 'And', 'But'];

    StepDeclarationModel.prototype.setValidValue = function (property, value) {
        if (property === 'type') {
            this[property] = value || _.first(this.types);
        } else {
            this[property] = value || DEFAULTS[property];
        }
    };

    StepDeclarationModel.getExampleVariableNames = _.memoize(function (step) {
        return _.chain(step.match(new RegExp('<.+?>', 'g')))
        .map(function (result) {
            return result.replace(/^</, '').replace(/>$/, '');
        }).value();
    });

    var toFeature = function () {
        return this.type + ' ' + this.step;
    };

    return StepDeclarationModel;
};

GherkinEditor.factory('StepDeclarationModel', function () {
    return StepDeclarationModel();
});
