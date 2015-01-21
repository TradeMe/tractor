'use strict';

// Module:
var ComponentEditor = require('../ComponentEditor');

// Dependencies:
require('../../../Core/Services/ASTCreatorService');

var BrowserModel = function (ASTCreatorService) {
    var ast = ASTCreatorService;

    var BrowserModel = function BrowserModel () {
        Object.defineProperty(this, 'name', {
            get: function () { return this.nameIdentifier.name; },
            set: function (name) { this.nameIdentifier.name = name; }
        });

        this.nameIdentifier = ast.createIdentifier('browser');
    };

    BrowserModel.prototype.methods = [{
        name: 'get',
        description: 'Navigate to the given destination and loads mock modules before Angular. Assumes that the page being loaded uses Angular. If you need to access a page which does not have Angular on load, use the wrapped webdriver directly.',
        arguments: [{
            name: 'destination',
            description: 'Destination URL',
            type: 'string'
        }, {
            name: 'timeout',
            description: 'Number of milliseconds to wait for Angular to start.',
            type: 'number',
            optional: true
        }]
    }, {
        name: 'refresh',
        description: 'Makes a full reload of the current page and loads mock modules before Angular. Assumes that the page being loaded uses Angular. If you need to access a page which does not have Angular on load, use the wrapped webdriver directly.',
        arguments: [{
            name: 'timeout',
            description: 'Number of seconds to wait for Angular to start.',
            type: 'number',
            optional: true
        }]
    }, {
        name: 'setLocation',
        description: 'Browse to another page using in-page navigation.',
        arguments: [{
            name: 'url',
            description: 'In page URL using the same syntax as $location.url()',
            type: 'string'
        }],
        returns: 'promise'
    }, {
        name: 'getLocationAbsUrl',
        description: 'Returns the current absolute url from AngularJS.',
        returns: 'string',
        string: {
            name: 'absoluteUrl',
            type: 'string'
        }
    }, {
        name: 'waitForAngular',
        description: 'Instruct webdriver to wait until Angular has finished rendering and has no outstanding $http calls before continuing.',
        returns: 'promise'
    }];

    return BrowserModel;
};

ComponentEditor.factory('BrowserModel', function (ASTCreatorService) {
    return BrowserModel(ASTCreatorService);
});
