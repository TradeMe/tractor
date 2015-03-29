'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var Core = require('../../Core');

var DropFileDirective = function () {
    return {
        restrict: 'A',

        scope: {
            onDrop: '&',
            dropDirectory: '='
        },

        link: link
    };

    function link ($scope, $element) {
        var element = _.first($element);

        element.addEventListener('dragover', dragover);
        element.addEventListener('dragenter', dragenter);
        element.addEventListener('dragleave', dragleave);
        element.addEventListener('drop', _.partial(drop, $scope));
    }

    function dragover (event) {
        event.dataTransfer.dropEffect = 'move';
        event.preventDefault();
        event.stopPropagation();
        Array.prototype.forEach.call(document.querySelectorAll('.dragover'), function (element) {
            element.classList.remove('dragover');
        });
        this.classList.add('dragover');
        return false;
    }

    function dragenter () {
        Array.prototype.forEach.call(document.querySelectorAll('.dragover'), function (element) {
            element.classList.remove('dragover');
        });
        this.classList.add('dragover');
        return false;
    }

    function dragleave () {
        this.classList.remove('dragover');
        return false;
    }

    function drop ($scope, event) {
        event.preventDefault();
        event.stopPropagation();
        this.classList.remove('dragover');
        var file = JSON.parse(event.dataTransfer.getData('file'));
        var directory = $scope.dropDirectory;
        var dropHandler = $scope.onDrop();
        dropHandler(file, directory);
        return false;
    }
};

Core.directive('tractorDropFile', DropFileDirective);
