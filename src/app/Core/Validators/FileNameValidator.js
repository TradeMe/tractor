'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var Core = require('../Core');

// Dependencies:
require('../Components/Notifier/NotifierService');

var FileNameValidator = function FileNameValidator (
    notifierService
) {
    return {
        restrict: 'A',

        require: 'ngModel',

        link: link
    };

    function link ($scope, $element, $attrs, ngModelController) {
        ngModelController.$validators.fileName = function (value) {
            if (_.contains(value, '_')) {
                notifierService.error('Invalid character: "_"');
                return false;
            }
            if (_.contains(value, '/')) {
                notifierService.error('Invalid character: "/"');
                return false;
            }
            if (_.contains(value, '\\')) {
                notifierService.error('Invalid character: "\\"');
                return false;
            }
            return true;
        };
    }
};

Core.directive('fileName', FileNameValidator);
