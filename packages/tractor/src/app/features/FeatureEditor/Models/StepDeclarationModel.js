'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var FeatureEditor = require('../FeatureEditor');

var createStepDeclarationModelConstructor = function () {
    var StepDeclarationModel = function StepDeclarationModel () {
        Object.defineProperties(this, {
            feature: {
                get: function () {
                    return toFeature.call(this);
                }
            }
        });

        this.type = _.first(this.types);
        this.step = '';
    };

    StepDeclarationModel.prototype.types = ['Given', 'When', 'Then', 'And', 'But'];

    StepDeclarationModel.getExampleVariableNames = _.memoize(function (step) {
        return _.chain(step.match(new RegExp('<.+?>', 'g')))
        .map(function (result) {
            return result.replace(/^</, '').replace(/>$/, '');
        }).value();
    });

    return StepDeclarationModel;

    function toFeature () {
        return this.type + ' ' + this.step;
    }
};

FeatureEditor.factory('StepDeclarationModel', function () {
    return createStepDeclarationModelConstructor();
});
