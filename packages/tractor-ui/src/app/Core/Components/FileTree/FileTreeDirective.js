'use strict';

// Utilities:
var _ = require('lodash');
var fs = require('fs');

// Module:
var Core = require('../../Core');

// Dependencies:
require('./FileTreeController');

var FileTreeDirective = function () {
    return {
        restrict: 'E',

        scope: {
            fileStructure: '=',
            extension: '@',
            create: '=',
            delete: '=',
            move: '=',
            fileStyle: '=',
            readonly: '='
        },

        /* eslint-disable no-path-concat */
        template: fs.readFileSync(__dirname + '/FileTree.html', 'utf8'),
        /* eslint-enable no-path-concat */

        controller: 'FileTreeController',
        controllerAs: 'fileTree',
        bindToController: true
    };
};

Core.directive('tractorFileTree', FileTreeDirective);
