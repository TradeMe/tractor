'use strict';

// Utilities:
var Promise = require('bluebird');

// Module:
var Core = require('../Core');

Core.factory('HttpResponseInterceptor', function (
    NotifierService
) {
    return {
        response: handleResponseData,
        responseError: handleResponseError
    };

    function handleResponseData (response) {
        return Promise.resolve(response.config.url.match(/.html$/) ? response : response.data);
    }

    function handleResponseError (response) {
        var error = new Error();
        try {
            NotifierService.error(response.data.error);
            error.message = response.data.error;
            error.response = response;
        } catch (e) { }
        return Promise.reject(error);
    }
})
.config(function ($httpProvider) {
    $httpProvider.interceptors.push('HttpResponseInterceptor');
});
