/* global describe:true, it:true */
'use strict';

// Utilities:
var _ = require('lodash');
var Promise = require('bluebird');

// Test utilities:
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

// Test setup:
var expect = chai.expect;
chai.use(sinonChai);

var stepDefinitionUtils = require('./step-definition-utils');

describe('server/utils: step-definition-utils:', function () {
    it('should generate files for each step in a feature:', function () {
        var childProcess = require('child_process');
        var os = require('os');
        var path = require('path');

        var fileStructure = {
            path: '/some/path/',
            files: [],
            allFiles: []
        };
        var request = {
            body: {
                data: 'Feature: Test' + os.EOL +
                  'In order to test' + os.EOL +
                  'As a test' + os.EOL +
                  'I want to test' + os.EOL +
                  'Scenario: Test' + os.EOL +
                    'Given something' + os.EOL +
                    'And something else' + os.EOL +
                    'When something happens' + os.EOL +
                    'Then something else happens' + os.EOL +
                    'But something else does not happen',
                path: ''
            }
        };
        var result = 'this.Given(/^something$/, function (callback) {' + os.EOL +
                     '    // Write code here that turns the phrase above into concrete actions' + os.EOL +
                     '    callback.pending();' + os.EOL +
                     '});' + os.EOL +
                     '' + os.EOL +
                     'this.Given(/^something else$/, function (callback) {' + os.EOL +
                     '    // Write code here that turns the phrase above into concrete actions' + os.EOL +
                     '    callback.pending();' + os.EOL +
                     '});' + os.EOL +
                     '' + os.EOL +
                     'this.When(/^something happens$/, function (callback) {' + os.EOL +
                     '    // Write code here that turns the phrase above into concrete actions' + os.EOL +
                     '    callback.pending();' + os.EOL +
                     '});' + os.EOL +
                     '' + os.EOL +
                     'this.Then(/^something else happens$/, function (callback) {' + os.EOL +
                     '    // Write code here that turns the phrase above into concrete actions' + os.EOL +
                     '    callback.pending();' + os.EOL +
                     '});' + os.EOL +
                     '' + os.EOL +
                     'this.Then(/^something else does not happen$/, function (callback) {' + os.EOL +
                     '    // Write code here that turns the phrase above into concrete actions' + os.EOL +
                     '    callback.pending();' + os.EOL +
                     '});';

        sinon.stub(childProcess, 'execAsync').returns(Promise.all([Promise.resolve(result)]));
        sinon.stub(console, 'log');
        sinon.stub(path, 'join').returns('/some/path/');

        return stepDefinitionUtils.generateStepDefinitions(fileStructure, request)
        .then(function () {
            expect(fileStructure.files[0].name).to.equal('Given something');
            expect(fileStructure.files[1].name).to.equal('Given something else');
            expect(fileStructure.files[2].name).to.equal('When something happens');
            expect(fileStructure.files[3].name).to.equal('Then something else happens');
            expect(fileStructure.files[4].name).to.equal('Then something else does not happen');
        })
        .finally(function () {
            childProcess.execAsync.restore();
            console.log.restore();
            path.join.restore();
        });
    });

    it('should escape underscore:', function () {
        var childProcess = require('child_process');
        var os = require('os');
        var path = require('path');

        var fileStructure = {
            path: '/some/path/',
            files: [],
            allFiles: []
        };
        var request = {
            body: {
                data: 'Feature: Test' + os.EOL +
                  'In order to test' + os.EOL +
                  'As a test' + os.EOL +
                  'I want to test' + os.EOL +
                  'Scenario: Test' + os.EOL +
                    'Given _' + os.EOL,
                path: ''
            }
        };
        var result = 'this.Given(/^_$/, function (callback) {' + os.EOL +
                     '    // Write code here that turns the phrase above into concrete actions' + os.EOL +
                     '    callback.pending();' + os.EOL +
                     '});';

        sinon.stub(childProcess, 'execAsync').returns(Promise.all([Promise.resolve(result)]));
        sinon.stub(console, 'log');
        sinon.stub(path, 'join').returns('/some/path/');

        return stepDefinitionUtils.generateStepDefinitions(fileStructure, request)
        .then(function () {
            var file = _.first(fileStructure.files);
            var meta = _.first(file.ast.comments).value;
            expect(file.name).to.equal('Given __');
            expect(JSON.parse(meta).name).to.equal('Given _');
        })
        .finally(function () {
            childProcess.execAsync.restore();
            console.log.restore();
            path.join.restore();
        });
    });

    it('should escape slashes:', function () {
        var childProcess = require('child_process');
        var os = require('os');
        var path = require('path');

        var fileStructure = {
            path: '/some/path/',
            files: [],
            allFiles: []
        };
        var request = {
            body: {
                data: 'Feature: Test' + os.EOL +
                  'In order to test' + os.EOL +
                  'As a test' + os.EOL +
                  'I want to test' + os.EOL +
                  'Scenario: Test' + os.EOL +
                    'Given /\\' + os.EOL,
                path: ''
            }
        };
        var result = 'this.Given(/^\\\/\\\\$/, function (callback) {' + os.EOL +
                     '    // Write code here that turns the phrase above into concrete actions' + os.EOL +
                     '    callback.pending();' + os.EOL +
                     '});';

        sinon.stub(childProcess, 'execAsync').returns(Promise.all([Promise.resolve(result)]));
        sinon.stub(console, 'log');
        sinon.stub(path, 'join').returns('/some/path/');

        return stepDefinitionUtils.generateStepDefinitions(fileStructure, request)
        .then(function () {
            var file = _.first(fileStructure.files);
            var meta = _.first(file.ast.comments).value;
            expect(file.name).to.equal('Given __');
            expect(JSON.parse(meta).name).to.equal('Given /\\');
        })
        .finally(function () {
            childProcess.execAsync.restore();
            console.log.restore();
            path.join.restore();
        });
    });

    it('should escape brackets:', function () {
        var childProcess = require('child_process');
        var os = require('os');
        var path = require('path');

        var fileStructure = {
            path: '/some/path/',
            files: [],
            allFiles: []
        };
        var request = {
            body: {
                data: 'Feature: Test' + os.EOL +
                  'In order to test' + os.EOL +
                  'As a test' + os.EOL +
                  'I want to test' + os.EOL +
                  'Scenario: Test' + os.EOL +
                    'Given <>' + os.EOL,
                path: ''
            }
        };
        var result = 'this.Given(/^<>$/, function (callback) {' + os.EOL +
                     '    // Write code here that turns the phrase above into concrete actions' + os.EOL +
                     '    callback.pending();' + os.EOL +
                     '});';

        sinon.stub(childProcess, 'execAsync').returns(Promise.all([Promise.resolve(result)]));
        sinon.stub(console, 'log');
        sinon.stub(path, 'join').returns('/some/path/');

        return stepDefinitionUtils.generateStepDefinitions(fileStructure, request)
        .then(function () {
            var file = _.first(fileStructure.files);
            var meta = _.first(file.ast.comments).value;
            expect(file.name).to.equal('Given __');
            expect(JSON.parse(meta).name).to.equal('Given <>');
        })
        .finally(function () {
            childProcess.execAsync.restore();
            console.log.restore();
            path.join.restore();
        });
    });

    it('should escape money amounts:', function () {
        var childProcess = require('child_process');
        var os = require('os');
        var path = require('path');

        var fileStructure = {
            path: '/some/path/',
            files: [],
            allFiles: []
        };
        var request = {
            body: {
                data: 'Feature: Test' + os.EOL +
                  'In order to test' + os.EOL +
                  'As a test' + os.EOL +
                  'I want to test' + os.EOL +
                  'Scenario: Test' + os.EOL +
                    'When $100' + os.EOL,
                path: ''
            }
        };
        var result = 'this.When(/^\\$\\d+$/, function (callback) {' + os.EOL +
                     '    // Write code here that turns the phrase above into concrete actions' + os.EOL +
                     '    callback.pending();' + os.EOL +
                     '});';

        sinon.stub(childProcess, 'execAsync').returns(Promise.all([Promise.resolve(result)]));
        sinon.stub(console, 'log');
        sinon.stub(path, 'join').returns('/some/path/');

        return stepDefinitionUtils.generateStepDefinitions(fileStructure, request)
        .then(function () {
            var file = _.first(fileStructure.files);
            var meta = _.first(file.ast.comments).value;
            expect(file.name).to.equal('When $amount');
            expect(JSON.parse(meta).name).to.equal('When $100');
        })
        .finally(function () {
            childProcess.execAsync.restore();
            console.log.restore();
            path.join.restore();
        });
    });

    it('should escape number amounts:', function () {
        var childProcess = require('child_process');
        var os = require('os');
        var path = require('path');

        var fileStructure = {
            path: '/some/path/',
            files: [],
            allFiles: []
        };
        var request = {
            body: {
                data: 'Feature: Test' + os.EOL +
                  'In order to test' + os.EOL +
                  'As a test' + os.EOL +
                  'I want to test' + os.EOL +
                  'Scenario: Test' + os.EOL +
                    'When 100' + os.EOL,
                path: ''
            }
        };
        var result = 'this.When(/^\\d+$/, function (callback) {' + os.EOL +
                     '    // Write code here that turns the phrase above into concrete actions' + os.EOL +
                     '    callback.pending();' + os.EOL +
                     '});';

        sinon.stub(childProcess, 'execAsync').returns(Promise.all([Promise.resolve(result)]));
        sinon.stub(console, 'log');
        sinon.stub(path, 'join').returns('/some/path/');

        return stepDefinitionUtils.generateStepDefinitions(fileStructure, request)
        .then(function () {
            var file = _.first(fileStructure.files);
            var meta = _.first(file.ast.comments).value;
            expect(file.name).to.equal('When $number');
            expect(JSON.parse(meta).name).to.equal('When 100');
        })
        .finally(function () {
            childProcess.execAsync.restore();
            console.log.restore();
            path.join.restore();
        });
    });

    it('should not overwrite existing files:', function () {
        var childProcess = require('child_process');
        var os = require('os');
        var path = require('path');

        var file = {
            name: 'Given something',
            path: '/some/path/Given something.step.js'
        };
        var fileStructure = {
            path: '/some/path/',
            files: [file],
            allFiles: [file]
        };
        var request = {
            body: {
                data: 'Feature: Test' + os.EOL +
                  'In order to test' + os.EOL +
                  'As a test' + os.EOL +
                  'I want to test' + os.EOL +
                  'Scenario: Test' + os.EOL +
                    'Given something' + os.EOL,
                path: ''
            }
        };
        var result = 'this.Given(/^something$/, function (callback) {' + os.EOL +
                     '    // Write code here that turns the phrase above into concrete actions' + os.EOL +
                     '    callback.pending();' + os.EOL +
                     '});';

        sinon.stub(childProcess, 'execAsync').returns(Promise.all([Promise.resolve(result)]));
        sinon.stub(console, 'log');
        sinon.stub(path, 'join').returns('/some/path/');

        return stepDefinitionUtils.generateStepDefinitions(fileStructure, request)
        .then(function () {
            expect(_.first(fileStructure.files)).to.equal(file);
        })
        .finally(function () {
            childProcess.execAsync.restore();
            console.log.restore();
            path.join.restore();
        });
    });
});
