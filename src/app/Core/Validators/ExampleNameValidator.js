'use strict';

// Utilities:
var _ = require('lodash');
var Promise = require('bluebird');

// Module:
var Core = require('../Core');

// Dependencies:
require('../Services/ValidationService');
require('../../features/FeatureEditor/Models/StepDeclarationModel');

var ExampleNameValidator = function (
    ValidationService,
    StepDeclarationModel
) {
    return {
        restrict: 'A',

        require: 'ngModel',

        link: link
    };

    function link ($scope, $element, $attrs, ngModelController) {
        ngModelController.$asyncValidators.exampleName = function (value) {
            var variableNames = StepDeclarationModel.getExampleVariableNames(value);
            var validations = _.map(variableNames, function (variableName) {
                return ValidationService.validateVariableName(variableName);
            });

            return Promise.all(validations);
        };
    }
};

Core.directive('exampleName', ExampleNameValidator);
