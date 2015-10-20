'use strict';

// Module:
var Core = require('../Core');

var PersistentStateService = function PersistentStateService (
    localStorageService
) {
    var PERSISTENT_STATE_KEY = 'PERSISTENT_STATE';

    return {
        get: get,
        set: set,
        remove: remove
    };

    function get (name) {
        var state = localStorageService.get(PERSISTENT_STATE_KEY) || {};
        return state[name] || {};
    }

    function set (name, value) {
        var state = localStorageService.get(PERSISTENT_STATE_KEY) || {};
        state[name] = value;
        localStorageService.set(PERSISTENT_STATE_KEY, state);
    }

    function remove (name) {
        var state = localStorageService.get(PERSISTENT_STATE_KEY) || {};
        delete state[name];
        localStorageService.set(PERSISTENT_STATE_KEY, state);
    }
};

Core.service('persistentStateService', PersistentStateService);
