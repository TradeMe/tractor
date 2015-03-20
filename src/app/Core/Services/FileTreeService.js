'use strict';

// Module:
var Core = require('../Core');

var FileTreeService = function FileTreeService (
    $http
) {
    return {
        editDirectory: editDirectory
    };

    function editDirectory (options) {
        return $http.post('/edit-directory', {
            path: options.path,
            oldName: options.oldName || null,
            newName: options.newName || null
        });
    }
};

Core.service('FileTreeService', FileTreeService);
