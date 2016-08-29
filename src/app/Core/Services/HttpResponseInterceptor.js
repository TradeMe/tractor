'use strict';

// Utilities:
var Promise = require('bluebird');

// Module:
var Core = require('../Core');

Core.factory('httpResponseInterceptor', function (
    notifierService
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
        notifierService.error(response.data.error);
        error.message = response.data.error;
        error.response = response;
        return Promise.reject(error);
    }
})
.config(function ($httpProvider) {
    $httpProvider.interceptors.push('httpResponseInterceptor');
});
