/* global describe:true, beforeEach: true, afterEach:true, it:true */
'use strict';

var chai = require('chai');
var rewire = require('rewire');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

var expect = chai.expect;
chai.use(sinonChai);

// Under test:
var saveFile;

// Utilities:
var _ = require('lodash');

// Mocks:
var fileStructureModiferMock = require('../utils/file-structure-modifier.mock');
var fileStructureUtilsMock = require('../utils/file-structure-utils/file-structure-utils.mock');
var stepDefinitionUtilsMock = require('../utils/step-definition-utils.mock');
var revert;

describe('server/api: save-file:', function () {
    beforeEach(function () {
        saveFile = rewire('./save-file');
        /* eslint-disable no-underscore-dangle */
        revert = saveFile.__set__({
            fileStructureModifier: fileStructureModiferMock,
            fileStructureUtils: fileStructureUtilsMock,
            stepDefinitionUtils: stepDefinitionUtilsMock
        });
        /* eslint-enable no-underscore-dangle */
    });

    afterEach(function () {
        revert();
    });

    it('should save a file:', function () {
        var fileStructure = {
            allFiles: []
        };
        var directory = {
            files: []
        };
        var request = {
            params: {
                type: 'components'
            },
            body: {
                path: 'file'
            }
        };

        sinon.stub(fileStructureModiferMock, 'create', function (options) {
            return function (fileStructure, request) {
                options.preSave(fileStructure, request);
                options.postSave(fileStructure, request);
            };
        });
        sinon.stub(fileStructureUtilsMock, 'findDirectory').returns(directory);
        sinon.stub(fileStructureUtilsMock, 'getExtension').returns(directory);

        saveFile = saveFile();
        saveFile(fileStructure, request);

        expect(fileStructure.allFiles.length).to.equal(1);
        expect(directory.files.length).to.equal(1);
        var savedFile = _.last(directory.files);
        expect(savedFile).to.equal(_.last(fileStructure.allFiles));
        expect(savedFile.name).to.equal('file');

        fileStructureModiferMock.create.restore();
        fileStructureUtilsMock.findDirectory.restore();
        fileStructureUtilsMock.getExtension.restore();
    });

    it('should save a Component file:', function () {
        var fileStructure = {
            allFiles: []
        };
        var directory = {
            files: []
        };
        var ast = { };
        var request = {
            params: {
                type: 'components'
            },
            body: {
                data: ast
            }
        };

        sinon.stub(fileStructureModiferMock, 'create', function (options) {
            return function (fileStructure, request) {
                options.preSave(fileStructure, request);
                options.postSave(fileStructure, request);
            };
        });
        sinon.stub(fileStructureUtilsMock, 'findDirectory').returns(directory);
        sinon.stub(fileStructureUtilsMock, 'getExtension').returns(directory);

        saveFile = saveFile();
        saveFile(fileStructure, request);

        var savedFile = _.last(directory.files);
        expect(savedFile.ast).to.equal(ast);

        fileStructureModiferMock.create.restore();
        fileStructureUtilsMock.findDirectory.restore();
        fileStructureUtilsMock.getExtension.restore();
    });

    it('should save a Step Definition file:', function () {
        var fileStructure = {
            allFiles: []
        };
        var directory = {
            files: []
        };
        var ast = { };
        var request = {
            params: {
                type: 'step_definitions'
            },
            body: {
                data: ast
            }
        };

        sinon.stub(fileStructureModiferMock, 'create', function (options) {
            return function (fileStructure, request) {
                options.preSave(fileStructure, request);
                options.postSave(fileStructure, request);
            };
        });
        sinon.stub(fileStructureUtilsMock, 'findDirectory').returns(directory);
        sinon.stub(fileStructureUtilsMock, 'getExtension').returns(directory);

        saveFile = saveFile();
        saveFile(fileStructure, request);

        var savedFile = _.last(directory.files);
        expect(savedFile.ast).to.equal(ast);

        fileStructureModiferMock.create.restore();
        fileStructureUtilsMock.findDirectory.restore();
        fileStructureUtilsMock.getExtension.restore();
    });

    it('should save a Mock Data file:', function () {
        var fileStructure = {
            allFiles: []
        };
        var directory = {
            files: []
        };
        var content = 'data';
        var request = {
            params: {
                type: 'mock_data'
            },
            body: {
                data: content
            }
        };

        sinon.stub(fileStructureModiferMock, 'create', function (options) {
            return function (fileStructure, request) {
                options.preSave(fileStructure, request);
                options.postSave(fileStructure, request);
            };
        });
        sinon.stub(fileStructureUtilsMock, 'findDirectory').returns(directory);
        sinon.stub(fileStructureUtilsMock, 'getExtension').returns(directory);

        saveFile = saveFile();
        saveFile(fileStructure, request);

        var savedFile = _.last(directory.files);
        expect(savedFile.content).to.equal(content);

        fileStructureModiferMock.create.restore();
        fileStructureUtilsMock.findDirectory.restore();
        fileStructureUtilsMock.getExtension.restore();
    });

    it('should save a Feature file and create step definitions:', function () {
        var os = require('os');
        var fileStructure = {
            allFiles: []
        };
        var directory = {
            files: []
        };
        var content = 'feature%%NEWLINE%%';
        var request = {
            params: {
                type: 'features'
            },
            body: {
                data: content
            }
        };

        sinon.stub(fileStructureModiferMock, 'create', function (options) {
            return function (fileStructure, request) {
                options.preSave(fileStructure, request);
                options.postSave(fileStructure, request);
            };
        });
        sinon.stub(fileStructureUtilsMock, 'findDirectory').returns(directory);
        sinon.stub(fileStructureUtilsMock, 'getExtension').returns(directory);
        sinon.stub(stepDefinitionUtilsMock, 'generateStepDefinitions');

        saveFile = saveFile();
        saveFile(fileStructure, request);

        var savedFile = _.last(directory.files);
        expect(savedFile.content).to.equal('feature' + os.EOL);
        expect(stepDefinitionUtilsMock.generateStepDefinitions.callCount).to.equal(1);

        fileStructureModiferMock.create.restore();
        fileStructureUtilsMock.findDirectory.restore();
        fileStructureUtilsMock.getExtension.restore();
        stepDefinitionUtilsMock.generateStepDefinitions.restore();
    });
});
