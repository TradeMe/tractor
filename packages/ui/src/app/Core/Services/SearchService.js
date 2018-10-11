'use strict';

// Module:
var Core = require('../Core');

var SearchService = function (
    $http
) {
    return {
        search
    };

    function search (searchString) {
        return $http.get('/search', {
            params: {
                searchString: searchString
            }
        });
    }
};

Core.service('searchService', SearchService);
