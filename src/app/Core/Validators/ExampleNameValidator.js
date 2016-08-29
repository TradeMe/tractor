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
    validationService,
    StepDeclarationModel
) {
    return {
        restrict: 'A',

        require: 'ngModel',

        link: link
    };

    function link ($scope, $element, $attrs, ngModelController) {
        ngModelController.$validators.exampleName = function (value) {
            var variableNames = StepDeclarationModel.getExampleVariableNames(value);
            return _.filter(variableNames, function (variableName) {
                return validationService.validateVariableName(variableName);
            }).length === variableNames.length;
        };
    }
};

Core.directive('exampleName', ExampleNameValidator);
