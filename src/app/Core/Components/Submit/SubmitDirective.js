'use strict';

// Utilities:
var _ = require('lodash');
var fs = require('fs');

// Module:
var Core = require('../../Core');

var SubmitDirective = function () {
    return {
        restrict: 'E',

        scope: {
            action: '@'
        },

        /* eslint-disable no-path-concat */
        template: fs.readFileSync(__dirname + '/Submit.html', 'utf8'),
        /* eslint-enable no-path-concat */

        link: link
    };

    function link ($scope) {
        if (_.isUndefined($scope.action)) {
            throw new Error('The "tractor-submit" directive requires an "action" attribute.');
        }
    }
};

Core.directive('tractorSubmit', SubmitDirective);
