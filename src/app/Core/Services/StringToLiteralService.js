'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var Core = require('../Core');

var StringToLiteralService = function () {
    return {
        toLiteral: toLiteral
    };

    function toLiteral (value) {
        var boolean = toBoolean(value);
        var number = toNumber(value);
        var nil = toNull(value);
        if (boolean != null) {
            return boolean;
        } else if (number != null) {
            return number;
        } else if (nil === null) {
            return nil;
        }
    }

    function toBoolean (value) {
        if (value === 'true') {
            return true;
        } else if (value === 'false') {
            return false;
        }
    }

    function toNumber (value) {
        var number = +value;
        if (value && _.isNumber(number) && !_.isNaN(number)) {
            return number;
        }
    }

    function toNull (value) {
        if (value === 'null') {
            return null;
        }
    }
};

Core.service('StringToLiteralService', StringToLiteralService);
