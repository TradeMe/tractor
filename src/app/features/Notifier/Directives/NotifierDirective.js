'use strict';

// Utilities:
var fs = require('fs');

// Module:
var Notifier = require('../Notifier');

// Dependencies:
require('../Services/NotifierService');

var NotifierDirective = function (NotifierService) {
    return {
        restrict: 'E',
        template: fs.readFileSync(__dirname + '/Notifier.html', 'utf8'),

        link: function ($scope) {
            $scope.notifications = NotifierService.notifications;
            $scope.dismiss = NotifierService.dismiss;
        }
    };
};

Notifier.directive('tractorNotifier', NotifierDirective);
