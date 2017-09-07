'use strict';

var $http = angular.injector(['ng']).get('$http');
var tractor = angular.module('tractor');

Promise.all([$http.get('/config'), $http.get('/plugins')])
.then(function (data) {
    var config = data.shift();
    var plugins = data.shift();
    tractor.constant('config', config.data);
    tractor.constant('plugins', plugins.data);
    angular.bootstrap(document.body, ['tractor'], {
        strictDi: true
    });
});
