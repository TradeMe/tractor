/* global describe:true, it:true */
'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var Promise = require('bluebird');

var expect = chai.expect;
chai.use(sinonChai);

var setUpSelenium = require('./set-up-selenium');

describe('server/cli/init: set-up-selenium:', function () {
    it('should run the "webdriver-manager update" command', function () {
        var childProcess = require('child_process');
        var log = require('../../utils/logging');
		var path = require('path');
        sinon.stub(childProcess, 'execAsync').returns(Promise.resolve());
        sinon.stub(log, 'info');
        sinon.stub(log, 'success');

        return setUpSelenium.run()
        .then(function () {
			var webdriverManagerPath = path.join('node_modules', 'protractor', 'bin', 'webdriver-manager');
            expect(childProcess.execAsync).to.have.been.calledWith('node ' + webdriverManagerPath + ' update');
        })
        .finally(function () {
            childProcess.execAsync.restore();
            log.info.restore();
            log.success.restore();
        });
    });

    it('should tell the user what it is doing', function () {
        var childProcess = require('child_process');
        var log = require('../../utils/logging');
        sinon.stub(childProcess, 'execAsync').returns(Promise.resolve());
        sinon.stub(log, 'info');
        sinon.stub(log, 'success');

        return setUpSelenium.run()
        .then(function () {
            expect(log.info).to.have.been.calledWith('Setting up Selenium...');
            expect(log.success).to.have.been.calledWith('Selenium setup complete.');
        })
        .finally(function () {
            childProcess.execAsync.restore();
            log.info.restore();
            log.success.restore();
        });
    });
});
