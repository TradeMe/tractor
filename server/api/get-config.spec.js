/* global describe:true, it:true */
'use strict';

// Test Utilities:
var chai = require('chai');
var dirtyChai = require('dirty-chai');
var noop = require('node-noop').noop;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

// Test setup:
var expect = chai.expect;
chai.use(dirtyChai);
chai.use(sinonChai);

// Under test:
var getConfig = require('./get-config');

describe('server/api: get-config', function () {
    it('should respond with the current config:', function () {
        var response = {
            send: noop
        };
        sinon.spy(response, 'send');
        sinon.stub(JSON, 'stringify').returns('JSON');

        getConfig({}, response);

        expect(response.send).to.have.been.calledWith('JSON');

        JSON.stringify.restore();
    });
});
