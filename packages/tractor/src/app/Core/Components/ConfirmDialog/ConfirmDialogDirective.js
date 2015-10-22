'use strict';

// Utilities:
var _ = require('lodash');
var fs = require('fs');

// Module:
var Core = require('../../Core');

// Dependencies:
require('./ConfirmDialogController');

var ConfirmDialogDirective = function () {
    return {
        restrict: 'E',
        transclude: true,

        scope: {
            trigger: '='
        },

        /* eslint-disable no-path-concat */
        template: fs.readFileSync(__dirname + '/ConfirmDialog.html', 'utf8'),
        /* eslint-enable no-path-concat */

        controller: 'ConfirmDialogController',
        controllerAs: 'confirmDialog',
        bindToController: true,
    };
};

Core.directive('tractorConfirmDialog', ConfirmDialogDirective);
