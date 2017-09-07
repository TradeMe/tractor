'use strict';

export const GET = {
    name: 'get',
    description: 'Navigate to the given destination and loads mock modules before Angular.',
    arguments: [{
        name: 'destination',
        description: 'Destination URL',
        type: 'string',
        required: true
    }, {
        name: 'timeout',
        description: 'Number of milliseconds to wait for Angular to start.',
        type: 'number'
    }]
};

export const REFRESH = {
    name: 'refresh',
    description: 'Makes a full reload of the current page and loads mock modules before Angular. Assumes that the page being loaded uses Angular.',
    arguments: [{
        name: 'timeout',
        description: 'Number of seconds to wait for Angular to start.',
        type: 'number'
    }]
};

export const SET_LOCATION = {
    name: 'setLocation',
    description: 'Browse to another page using in-page navigation.',
    arguments: [{
        name: 'url',
        description: 'In page URL using the same syntax as $location.url()',
        type: 'string',
        required: true
    }],
    returns: 'promise'
};

export const GET_LOCATION_ABS_URL = {
    name: 'getLocationAbsUrl',
    description: 'Returns the current absolute url from AngularJS.',
    returns: 'string',
    string: {
        name: 'absoluteUrl',
        type: 'string',
        required: true
    }
};

export const WAIT_FOR_ANGULAR = {
    name: 'waitForAngular',
    description: 'Instruct webdriver to wait until Angular has finished rendering and has no outstanding $http calls before continuing.',
    returns: 'promise'
};
