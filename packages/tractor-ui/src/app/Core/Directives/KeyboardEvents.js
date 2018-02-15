// Module:
var Core = require('../Core');

Core.directive('keyboardEvents', function ($document, $rootScope) {
    return {
        restrict: 'A',
        link: function () {
            $document.bind('keydown', function (e) {
                $rootScope.$broadcast('keyboard', e);
                $rootScope.$broadcast('keyboard:' + e.code, e);
            });
        }
    };
});
