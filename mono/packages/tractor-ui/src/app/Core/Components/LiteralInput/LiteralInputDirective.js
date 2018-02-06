'use strict';

// Utilities:
var _ = require('lodash');
var fs = require('fs');

// Module:
var Core = require('../../Core');

var LiteralInputDirective = function () {
    return {
        restrict: 'E',

        scope: {
            model: '=',
            name: '=',
            description: '=',
            required: '=',
            type: '='
        },

        /* eslint-disable no-path-concat */
        template: fs.readFileSync(__dirname + '/LiteralInput.html', 'utf8'),
        /* eslint-enable no-path-concat */

        link: link
    };

    function link ($scope, $element, $attrs) {
        if (_.isUndefined($scope.model)) {
            throw new Error('The "tractor-literal-input" directive requires a "model" attribute.');
        }

        if (_.isUndefined($scope.name)) {
            throw new Error('The "tractor-literal-input" directive requires a "name" attribute.');
        }

        if (_.isUndefined($attrs.form)) {
            throw new Error('The "tractor-literal-input" directive requires a "form" attribute.');
        }

        $scope.form = $scope.$parent[$attrs.form] || $scope.$parent.$ctrl[$attrs.form];
        $scope.id = Math.floor(Math.random() * Date.now());
    }
};

Core.directive('tractorLiteralInput', LiteralInputDirective);
