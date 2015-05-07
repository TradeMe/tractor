'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var Core = require('../Core');

// Dependencies:
require('../Components/Notifier/NotifierService');

var FileNameValidator = function FileNameValidator (
    NotifierService
) {
    return {
        restrict: 'A',

        require: 'ngModel',

        link: link
    };

    function link ($scope, $element, $attrs, ngModelController) {
        ngModelController.$validators.fileName = function (value) {
            if (_.contains(value, '_')) {
                NotifierService.error('Invalid character: "_"');
                return false;
            }
            if (_.contains(value, '/')) {
                NotifierService.error('Invalid character: "/"');
                return false;
            }
            if (_.contains(value, '\\')) {
                NotifierService.error('Invalid character: "\\"');
                return false;
            }
            return true;
        };
    }
};

Core.directive('fileName', FileNameValidator);
