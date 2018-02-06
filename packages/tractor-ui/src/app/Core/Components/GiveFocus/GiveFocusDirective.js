'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var Core = require('../../Core');

var GiveFocusDirective = function () {
    return {
        restrict: 'A',

        scope: {
            focusOn: '='
        },

        link: link
    };

    function link ($scope, $element) {
        $scope.$watch('focusOn', function (currentValue) {
            var input = _.first($element);
            if (currentValue) {
                input.focus();
                input.select();
            } else {
                input.blur();
            }
        });
    }
};

Core.directive('tractorGiveFocus', GiveFocusDirective);
