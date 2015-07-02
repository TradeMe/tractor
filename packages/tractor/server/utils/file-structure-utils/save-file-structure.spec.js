/* global describe:true, it:true */
'use strict';

// Test Utilities:
var chai = require('chai');
var rewire = require('rewire');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

// Utilities:
var Promise = require('bluebird');

// Test setup:
var expect = chai.expect;
chai.use(sinonChai);

// Under test:
var saveFileStructure = rewire('./save-file-structure');

describe('server/api: save-file-structure:', function () {
    it('should turn any ASTs back into JavaScript:', function () {
        var fs = require('fs.extra');
        var jsondir = require('jsondir');

        var file = {
            ast: {
                type: 'Program',
                body: [{
                    type: 'FunctionDeclaration',
                    id: {
                        type: 'Identifier',
                        name: 'test'
                    },
                    params: [],
                    defaults: [],
                    body: {
                        type: 'BlockStatement',
                        body: []
                    },
                    generator: false,
                    expression: false
                }]
            }
        };
        var fileStructure = {
            path: '/path/to/tests/',
            allFiles: [file],
            files: [file]
        };

        sinon.stub(fs, 'copyRecursiveAsync').returns(Promise.resolve());
        sinon.stub(jsondir, 'json2dirAsync');

        return saveFileStructure(fileStructure)
        .then(function () {
            expect(file.ast).to.be.undefined();
            expect(file['-content']).to.equal('function test() {\n}');
        })
        .finally(function () {
            fs.copyRecursiveAsync.restore();
            jsondir.json2dirAsync.restore();
        });
    });

    it('should turn the file structure back into the JSONDir format:', function () {
        var fs = require('fs.extra');
        var jsondir = require('jsondir');

        var file = {
            name: 'file',
            path: '/components/some/path/file.component.js',
            content: 'content'
        };
        var directory = {
            name: 'subdirectory'
        };
        var fileStructure = {
            name: 'name',
            path: '/components/some/path',
            isDirectory: true,
            usages: {},
            files: [file],
            allFiles: [file],
            directories: [directory]
        };

        sinon.stub(fs, 'copyRecursiveAsync').returns(Promise.resolve());
        sinon.stub(jsondir, 'json2dirAsync');

        return saveFileStructure(fileStructure)
        .then(function () {
            expect(fileStructure['-name']).to.equal('name');
            expect(fileStructure['-path']).to.equal('/components/some/path');
            expect(fileStructure['-type']).to.equal('d');
            expect(fileStructure.isDirectory).to.be.undefined();
            expect(fileStructure.usages).to.be.undefined();
            expect(fileStructure.allFiles).to.be.undefined();

            expect(file['-path']).to.equal('/components/some/path/file.component.js');
            expect(file['-content']).to.equal('content');
            expect(file['-type']).to.equal('-');

            expect(fileStructure['file.component.js']).to.equal(file);
            expect(fileStructure.subdirectory).to.equal(directory);
        })
        .finally(function () {
            fs.copyRecursiveAsync.restore();
            jsondir.json2dirAsync.restore();
        });
    });

    it('should create a backup before saving over the previous files:', function () {
        var fs = require('fs.extra');
        var jsondir = require('jsondir');

        var fileStructure = {
            path: '/path/to/tests/'
        };

        sinon.stub(Date, 'now').returns('1234567890');
        sinon.stub(fs, 'copyRecursiveAsync').returns(Promise.resolve());
        sinon.stub(jsondir, 'json2dirAsync');

        return saveFileStructure(fileStructure)
        .then(function () {
            expect(fs.copyRecursiveAsync).to.have.been.calledWith('/path/to/tests/', '/path/to/backup-1234567890');
        })
        .finally(function () {
            Date.now.restore();
            fs.copyRecursiveAsync.restore();
            jsondir.json2dirAsync.restore();
        });
    });
});
