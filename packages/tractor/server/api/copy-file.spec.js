/* global describe:true, beforeEach:true, afterEach:true, it:true */
'use strict';

var chai = require('chai');
var rewire = require('rewire');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

var expect = chai.expect;
chai.use(sinonChai);

// Under test:
var copyFile;

// Utilities:
var _ = require('lodash');

// Mocks:
var fileStructureModiferMock = require('../utils/file-structure-modifier.mock');
var fileStructureUtilsMock = require('../utils/file-structure-utils/file-structure-utils.mock');
var revert;

describe('server/api: copy-file:', function () {
    beforeEach(function () {
        copyFile = rewire('./copy-file');
        /* eslint-disable no-underscore-dangle */
        revert = copyFile.__set__({
            fileStructureModifier: fileStructureModiferMock,
            fileStructureUtils: fileStructureUtilsMock
        });
        /* eslint-enable no-underscore-dangle */
    });

    afterEach(function () {
        revert();
    });

    it('should create a copy of a file:', function () {
        var fileStructure = {
            allFiles: []
        };
        var directory = {
            files: []
        };
        var file = {
            name: 'file',
            content: 'content'
        };
        var request = {
            body: {}
        };

        sinon.stub(fileStructureModiferMock, 'create', function (options) {
            return options.preSave;
        });
        sinon.stub(fileStructureUtilsMock, 'findDirectory').returns(directory);
        sinon.stub(fileStructureUtilsMock, 'findFile').returns(file);

        copyFile = copyFile();
        copyFile(fileStructure, request);

        expect(directory.files.length).to.equal(1);
        expect(fileStructure.allFiles.length).to.equal(1);
        var copy = _.last(directory.files);
        expect(copy).to.equal(_.last(fileStructure.allFiles));
        expect(copy.name).to.equal('file (copy)');
        expect(copy.content).to.equal('content');

        fileStructureModiferMock.create.restore();
        fileStructureUtilsMock.findDirectory.restore();
        fileStructureUtilsMock.findFile.restore();
    });

    it('should always make a unique name for the copy:', function () {
        var fileStructure = {
            allFiles: []
        };
        var directory = {
            files: [{
                name: 'file (copy)'
            }]
        };
        var file = {
            name: 'file'
        };
        var request = {
            body: {}
        };

        sinon.stub(fileStructureModiferMock, 'create', function (options) {
            return options.preSave;
        });
        sinon.stub(fileStructureUtilsMock, 'findDirectory').returns(directory);
        sinon.stub(fileStructureUtilsMock, 'findFile').returns(file);

        copyFile = copyFile();
        copyFile(fileStructure, request);

        var copy = _.last(directory.files);
        expect(copy.name).to.equal('file (copy 2)');

        fileStructureModiferMock.create.restore();
        fileStructureUtilsMock.findDirectory.restore();
        fileStructureUtilsMock.findFile.restore();
    });

    it('should copy the `ast` of any JavaScript file and update the meta information:', function () {
        var fileStructure = {
            allFiles: []
        };
        var directory = {
            files: []
        };
        var ast = {
            comments: [{
                value: JSON.stringify({ name: 'file' })
            }]
        };
        var file = {
            name: 'file',
            ast: ast
        };
        var request = {
            body: {}
        };

        sinon.stub(fileStructureModiferMock, 'create', function (options) {
            return options.preSave;
        });
        sinon.stub(fileStructureUtilsMock, 'findDirectory').returns(directory);
        sinon.stub(fileStructureUtilsMock, 'findFile').returns(file);

        copyFile = copyFile();
        copyFile(fileStructure, request);

        var copy = _.last(directory.files);
        expect(copy.ast).not.to.be.undefined();
        expect(copy.ast).not.to.equal(ast);
        expect(JSON.parse(_.first(copy.ast.comments).value).name).to.equal('file (copy)');

        fileStructureModiferMock.create.restore();
        fileStructureUtilsMock.findDirectory.restore();
        fileStructureUtilsMock.findFile.restore();
    });
});
