'use strict';

// Utilities:
var Promise = require('bluebird');

// Module:
var Core = require('../Core');

var ConfirmDialogService = function ConfirmDialogService () {
    return {
        show: show
    };

    function show () {
        var resolve, reject;
        var promise = new Promise(function() {
            resolve = arguments[0];
            reject = arguments[1];
        });
        return {
            resolve: resolve,
            reject: reject,
            promise: promise
        };
    }
};

Core.service('confirmDialogService', ConfirmDialogService);
