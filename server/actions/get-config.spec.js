/* global describe:true, it:true */
'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

var noop = function () { };
var expect = chai.expect;
chai.use(sinonChai);

var getConfig = require('./get-config');

describe('server/actions: get-config', function () {
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
