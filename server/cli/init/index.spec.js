/* global describe:true, it:true */
'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var Promise = require('bluebird');

var expect = chai.expect;
chai.use(sinonChai);

var cliInit = require('./index');

describe('server/cli/init: index:', function () {
    it('should run the initialisation steps', function () {
        var createTestDirectoryStructure = require('./create-test-directory-structure');
        var createBaseTestFiles = require('./create-base-test-files');
        var installTractorDependenciesLocally = require('./install-tractor-dependencies-locally');
        var setUpSelenium = require('./set-up-selenium');
        var log = require('../../utils/logging');
        sinon.stub(createTestDirectoryStructure, 'run').returns(Promise.resolve());
        sinon.stub(createBaseTestFiles, 'run').returns(Promise.resolve());
        sinon.stub(installTractorDependenciesLocally, 'run').returns(Promise.resolve());
        sinon.stub(setUpSelenium, 'run').returns(Promise.resolve());
        sinon.stub(log, 'important');

        return cliInit()
        .then(function () {
            expect(createTestDirectoryStructure.run.callCount).to.equal(1);
            expect(createBaseTestFiles.run.callCount).to.equal(1);
            expect(installTractorDependenciesLocally.run.callCount).to.equal(1);
            expect(setUpSelenium.run.callCount).to.equal(1);
        })
        .finally(function () {
            createTestDirectoryStructure.run.restore();
            createBaseTestFiles.run.restore();
            installTractorDependenciesLocally.run.restore();
            setUpSelenium.run.restore();
            log.important.restore();
        });
    });

    it('should tell the user what it is doing', function () {
        var createTestDirectoryStructure = require('./create-test-directory-structure');
        var createBaseTestFiles = require('./create-base-test-files');
        var installTractorDependenciesLocally = require('./install-tractor-dependencies-locally');
        var setUpSelenium = require('./set-up-selenium');
        var log = require('../../utils/logging');
        sinon.stub(createTestDirectoryStructure, 'run').returns(Promise.resolve());
        sinon.stub(createBaseTestFiles, 'run').returns(Promise.resolve());
        sinon.stub(installTractorDependenciesLocally, 'run').returns(Promise.resolve());
        sinon.stub(setUpSelenium, 'run').returns(Promise.resolve());
        sinon.stub(log, 'important');

        return cliInit()
        .then(function () {
            expect(log.important).to.have.been.calledWith('Setting up tractor...');
            expect(log.important).to.have.been.calledWith('Set up complete!');
        })
        .finally(function () {
            createTestDirectoryStructure.run.restore();
            createBaseTestFiles.run.restore();
            installTractorDependenciesLocally.run.restore();
            setUpSelenium.run.restore();
            log.important.restore();
        });
    });

    it('should tell the user if there is an error', function () {
        var createTestDirectoryStructure = require('./create-test-directory-structure');
        var log = require('../../utils/logging');
        var message = 'error';
        sinon.stub(createTestDirectoryStructure, 'run').returns(Promise.reject(new Error(message)));
        sinon.stub(log, 'important');
        sinon.stub(log, 'error');

        return cliInit()
        .catch(function () {
            expect(log.error).to.have.been.calledWith('Something broke, sorry :(');
            expect(log.error).to.have.been.calledWith(message);
        })
        .finally(function () {
            createTestDirectoryStructure.run.restore();
            log.important.restore();
            log.error.restore();
        });
    });
});
