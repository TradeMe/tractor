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
        })
        .then(function (response) {
            return response.results;
        });
    }
};

Core.service('searchService', SearchService);
