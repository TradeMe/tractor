'use strict';

// Module:
var Core = require('../Core');

var ConfigService = function ConfigService (
    $http
) {
    return {
        getConfig: getConfig
    };

    function getConfig () {
        return $http.get('/config');
    }
};

Core.service('ConfigService', ConfigService);
