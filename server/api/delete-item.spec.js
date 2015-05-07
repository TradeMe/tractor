/* global describe:true, beforeEach: true, afterEach:true, it:true */
'use strict';

var chai = require('chai');
var rewire = require('rewire');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

var expect = chai.expect;
chai.use(sinonChai);

// Under test:
var deleteItem;

// Mocks:
var fileStructureModiferMock = require('../utils/file-structure-modifier.mock');
var fileStructureUtilsMock = require('../utils/file-structure-utils/file-structure-utils.mock');
var revert;

describe('server/api: delete-item:', function () {
    beforeEach(function () {
        deleteItem = rewire('./delete-item');
        /* eslint-disable no-underscore-dangle */
        revert = deleteItem.__set__({
            fileStructureModifier: fileStructureModiferMock,
            fileStructureUtils: fileStructureUtilsMock
        });
        /* eslint-enable no-underscore-dangle */
    });

    afterEach(function () {
        revert();
    });

    it('should delete a file:', function () {
        var fileStructure = {};
        var directory = {
            files: [{
                name: 'file'
            }]
        };
        var request = {
            query: {
                name: 'file'
            }
        };

        sinon.stub(fileStructureModiferMock, 'create', function (options) {
            return options.preSave;
        });
        sinon.stub(fileStructureUtilsMock, 'findDirectory').returns(directory);

        deleteItem = deleteItem();
        deleteItem(fileStructure, request);

        expect(directory.files.length).to.equal(0);

        fileStructureModiferMock.create.restore();
        fileStructureUtilsMock.findDirectory.restore();
    });

    it('should delete a directory:', function () {
        var fileStructure = {};
        var directory = {
            directories: [{
                name: 'directory'
            }]
        };
        var request = {
            query: {
                name: 'directory',
                isDirectory: true
            }
        };

        sinon.stub(fileStructureModiferMock, 'create', function (options) {
            return options.preSave;
        });
        sinon.stub(fileStructureUtilsMock, 'findDirectory').returns(directory);

        deleteItem = deleteItem();
        deleteItem(fileStructure, request);

        expect(directory.directories.length).to.equal(0);

        fileStructureModiferMock.create.restore();
        fileStructureUtilsMock.findDirectory.restore();
    });
});
