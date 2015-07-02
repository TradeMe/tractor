'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var Core = require('../../Core');

var PanelHandleDirective = function (
    persistentStateService
) {
    return {
        restrict: 'E',
        link: link
    };

    function link ($scope, $element, $attrs) {
        var $handle = $element;
        var $parent = $handle.parent();
        var $children = $parent.children();
        var $siblings = Array.prototype.filter.call($children, function (element) {
            return element !== _.first($handle);
        });
        var panelName = $attrs.panelName;

        var beforeElement = _.first($siblings);
        var afterElement = _.last($siblings);

        $handle.data('parent', _.first($parent));
        $handle.data('beforeElement', beforeElement);
        $handle.data('afterElement', afterElement);
        $handle.data('panelName', panelName);

        var handle = _.first($handle);
        handle.addEventListener('mousedown', _.partial(mousedown, $handle));

        var panelHandlePosition = persistentStateService.get(panelName);
        if (panelHandlePosition) {
            beforeElement.style.width = panelHandlePosition.before;
            afterElement.style.width = panelHandlePosition.after;
        }
    }

    function mousedown ($handle) {
        angular.element(document.body).data('handle', $handle)
        document.body.classList.add('resizing');
        document.body.addEventListener('mousemove', mousemove);
        document.body.addEventListener('mouseup', mouseup);
    }

    function mousemove (event) {
        var $body = angular.element(document.body);
        var $handle = $body.data('handle');
        var parent = $handle.data('parent');
        var beforeElement = $handle.data('beforeElement');
        var afterElement = $handle.data('afterElement');
        var containerWidth = parseFloat(window.getComputedStyle(parent).width);
        var percent = Math.max(10, event.clientX / containerWidth * 100);
        percent = Math.min(percent, 70);
        beforeElement.style.width = percent + '%';
        afterElement.style.width = 100 - 0.25 - percent + '%';
    }

    function mouseup () {
        var $body = angular.element(document.body);
        var $handle = $body.data('handle');
        var beforeElement = $handle.data('beforeElement');
        var afterElement = $handle.data('afterElement');
        var panelName = $handle.data('panelName');
        document.body.classList.remove('resizing');
        document.body.removeEventListener('mousemove', mousemove);
        document.body.removeEventListener('mouseup', mouseup);
        persistentStateService.set(panelName, {
            before: beforeElement.style.width,
            after: afterElement.style.width
        });
    }
};

Core.directive('tractorPanelHandle', PanelHandleDirective);
