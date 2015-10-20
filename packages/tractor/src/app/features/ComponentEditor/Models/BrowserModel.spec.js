/*global beforeEach:true, describe:true, it:true */
'use strict';

// Angular:
var angular = require('angular');
require('angular-mocks');

// Test Utilities:
var chai = require('chai');
var dirtyChai = require('dirty-chai');

// Test setup:
var expect = chai.expect;
chai.use(dirtyChai);

// Testing:
require('./BrowserModel');
var BrowserModel;

describe('BrowserModel.js:', function () {
    beforeEach(function () {
        angular.mock.module('ComponentEditor');

        angular.mock.inject(function (_BrowserModel_) {
            BrowserModel = _BrowserModel_;
        });
    });

    describe('BrowserModel constructor:', function () {
        it('should create a new `BrowserModel`:', function () {
            var browserModel = new BrowserModel();
            expect(browserModel).to.be.an.instanceof(BrowserModel);
        });

        it('should have default properties:', function () {
            var browserModel = new BrowserModel();

            expect(browserModel.name).to.equal('browser');
            expect(browserModel.variableName).to.equal('browser');
        });

        it('should have data about all the browser methods from Protractor:', function () {
            var browserModel = new BrowserModel();

            expect(browserModel.methods.length).to.equal(5);

            var get = browserModel.methods[0];
            var refresh = browserModel.methods[1];
            var setLocation = browserModel.methods[2];
            var getLocationAbsUrl = browserModel.methods[3];
            var waitForAngular = browserModel.methods[4];

            expect(get.name).to.equal('get');
            expect(refresh.name).to.equal('refresh');
            expect(setLocation.name).to.equal('setLocation');
            expect(getLocationAbsUrl.name).to.equal('getLocationAbsUrl');
            expect(waitForAngular.name).to.equal('waitForAngular');
        });
    });
});
