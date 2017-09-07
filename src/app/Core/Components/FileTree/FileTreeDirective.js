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
            type: '@',
            extension: '@',
            create: '=',
            delete: '=',
            move: '='
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
        if (_.isUndefined($scope.fileTree.type)) {
            throw new Error('The "tractor-file-tree" directive requires a "type" attribute.');
        }
    }
};

Core.directive('tractorFileTree', FileTreeDirective);
