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
            model: '=',
            type: '@'
        },

        /* eslint-disable no-path-concat */
        template: fs.readFileSync(__dirname + '/FileTree.html', 'utf8'),
        /* eslint-enable no-path-concat */

        controller: 'FileTreeController',
        controllerAs: 'fileTree',
        bindToController: true,
        link: link
    };

    function link ($scope) {
        if (_.isUndefined($scope.fileTree.model)) {
            throw new Error('The "tractor-file-tree" directive requires a "model" attribute.');
        }

        if (_.isUndefined($scope.fileTree.type)) {
            throw new Error('The "tractor-file-tree" directive requires a "type" attribute.');
        }
    }
};

Core.directive('tractorFileTree', FileTreeDirective);
