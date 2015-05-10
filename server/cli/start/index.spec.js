/* global describe:true, it:true */
'use strict';

// Test utilities:
var chai = require('chai');
var dirtyChai = require('dirty-chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

// Test setup:
var expect = chai.expect;
chai.use(dirtyChai);
chai.use(sinonChai);

// Under test:
var cliStart = require('./index');

describe('server/start: index:', function () {
    it('should start the application', function () {
        var log = require('../../utils/logging');
        var application = require('../../application');
        sinon.stub(log, 'important');
        sinon.stub(application, 'start');

        cliStart();

        expect(application.start.called).to.equal(true);

        log.important.restore();
    });
});
