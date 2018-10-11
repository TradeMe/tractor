'use strict';

// Utilities:
var fs = require('fs');

// Module:
var Core = require('../../Core');

// Dependencies:
require('./NotifierService');

var NotifierDirective = function (
    notifierService
) {
    return {
        restrict: 'E',

        /* eslint-disable no-path-concat */
        template: fs.readFileSync(__dirname + '/Notifier.html', 'utf8'),
        /* eslint-enable no-path-concat */

        link: function ($scope) {
            $scope.notifications = notifierService.notifications;
            $scope.dismiss = notifierService.dismiss;
        }
    };
};

Core.directive('tractorNotifier', NotifierDirective);
