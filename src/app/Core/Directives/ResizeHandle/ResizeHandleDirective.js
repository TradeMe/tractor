'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var Core = require('../../Core');

var ResizeHandleDirective = function (
    localStorageService
) {
    var RESIZE_HANDLER_KEY = 'ResizeHandlerPosition';

    return {
        restrict: 'E',
        link: link
    };

    var parent;
    var beforeElement;
    var afterElement;

    function link ($scope, $element) {
        var $parent = $element.parent();
        var $children = $parent.children();
        var $siblings = Array.prototype.filter.call($children, function (element) {
            return element !== _.first($element);
        });

        parent = _.first($parent);
        beforeElement = _.first($siblings);
        afterElement = _.last($siblings);

        var element = _.first($element);
        element.addEventListener('mousedown', mousedown);

        var resizeHandlerPosition = localStorageService.get(RESIZE_HANDLER_KEY);
        beforeElement.style.width = resizeHandlerPosition.before;
        afterElement.style.width = resizeHandlerPosition.after;
    }

    function mousedown () {
        document.body.classList.add('resizing');
        document.body.addEventListener('mousemove', mousemove);
        document.body.addEventListener('mouseup', mouseup);
    }

    function mousemove (event) {
        var containerWidth = parseFloat(window.getComputedStyle(parent).width);
        var percent = Math.max(10, event.clientX / containerWidth * 100);
        percent = Math.min(percent, 70);
        beforeElement.style.width = percent + '%';
        afterElement.style.width = 100 - 0.25 - percent + '%';
    }

    function mouseup () {
        document.body.classList.remove('resizing');
        document.body.removeEventListener('mousemove', mousemove);
        document.body.removeEventListener('mouseup', mouseup);
        localStorageService.set(RESIZE_HANDLER_KEY, {
            before: beforeElement.style.width,
            after: afterElement.style.width
        });
    }
};

Core.directive('tractorResizeHandle', ResizeHandleDirective);
