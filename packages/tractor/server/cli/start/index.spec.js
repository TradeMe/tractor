/* global describe:true, it:true */
'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

var expect = chai.expect;
chai.use(sinonChai);

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
