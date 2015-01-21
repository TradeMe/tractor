'use strict';

// Utilities:
var _ = require('lodash');
var fs = require('fs');

// Module:
var Core = require('../../Core');

var LiteralInputDirective = function () {
    var validateValue = function ($scope, value) {
        $scope.model = $scope.model || ($scope.optional ? '' : 'null');
    };

    return {
        restrict: 'E',
        scope: {
            model: '=',
            name: '=',
            optional: '='
        },
        template: fs.readFileSync(__dirname + '/LiteralInput.html', 'utf8'),
        link: function ($scope) {
            $scope.blur = _.curry(validateValue)($scope);
        }
    };
};

Core.directive('tractorLiteralInput', LiteralInputDirective);
