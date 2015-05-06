/* global describe:true, it:true */
'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

var _ = require('lodash');
var Promise = require('bluebird');

var expect = chai.expect;
chai.use(sinonChai);

var getFileStructure = require('./get-file-structure');

describe('server/utils: get-file-structure:', function () {
    it('should get the structure of a given directory:', function () {
        var jsondir = require('jsondir');
        var fileStructure = {};
        sinon.stub(jsondir, 'dir2jsonAsync').returns(Promise.resolve(fileStructure));

        return getFileStructure('directory/path')
        .finally(function () {
            expect(jsondir.dir2jsonAsync).to.have.been.calledWith('directory/path');

            jsondir.dir2jsonAsync.restore();
        });
    });

    it('should normalise the properties off the weird `jsondir` structure:', function () {
        var jsondir = require('jsondir');
        var fileStructure = {
            '-path': 'path',
            '-name': 'name',
            '-type': 'type'
        };
        sinon.stub(jsondir, 'dir2jsonAsync').returns(Promise.resolve(fileStructure));

        return getFileStructure('directory/path')
        .then(function (fileStructure) {
            expect(fileStructure.path).to.equal('path');
            expect(fileStructure['-path']).to.be.undefined();
            expect(fileStructure['-name']).to.be.undefined();
            expect(fileStructure['-type']).to.be.undefined();

            jsondir.dir2jsonAsync.restore();
        });
    });

    it('should organise the directories of the structure:', function () {
        var jsondir = require('jsondir');
        var fileStructure = {
            'directory': {
                '-type': 'd',
                '-path': 'path'
            }
        };
        sinon.stub(jsondir, 'dir2jsonAsync').returns(Promise.resolve(fileStructure));

        return getFileStructure('directory/path')
        .then(function (fileStructure) {
            var directory = _.first(fileStructure.directories);
            expect(directory.name).to.equal('directory');
            expect(directory.path).to.equal('path');
            expect(directory['-type']).to.be.undefined();
            expect(directory['-path']).to.be.undefined();
        })
        .finally(function () {
            jsondir.dir2jsonAsync.restore();
        });
    });

    it('should organise the files of the structure:', function () {
        var jsondir = require('jsondir');
        var fileStructure = {
            'file.file': {
                '-path': 'path',
                '-content': 'content'
            }
        };
        sinon.stub(jsondir, 'dir2jsonAsync').returns(Promise.resolve(fileStructure));

        return getFileStructure('directory/path')
        .then(function (fileStructure) {
            var file = _.first(fileStructure.files);
            expect(file.name).to.equal('file');
            expect(file.path).to.equal('path');
            expect(file.content).to.equal('content');
            expect(file['-path']).to.be.undefined();
            expect(file['-content']).to.be.undefined();
        })
        .finally(function () {
            jsondir.dir2jsonAsync.restore();
        });
    });

    it('should skip hidden files:', function () {
        var jsondir = require('jsondir');
        var fileStructure = {
            '.hiddenFile': {
            }
        };
        sinon.stub(jsondir, 'dir2jsonAsync').returns(Promise.resolve(fileStructure));

        return getFileStructure('directory/path')
        .then(function (fileStructure) {
            expect(fileStructure.files.length).to.equal(0);
        })
        .finally(function () {
            jsondir.dir2jsonAsync.restore();
        });
    });

    it('should gather all the files into one array:', function () {
        var jsondir = require('jsondir');
        var fileStructure = {
            '-path': 'path',
            'directory': {
                '-type': 'd',
                '-path': 'path',
                'file': {}
            },
            'otherDirectory': {
                '-type': 'd',
                '-path': 'path'
            },
            'otherFile': {}
        };
        sinon.stub(jsondir, 'dir2jsonAsync').returns(Promise.resolve(fileStructure));

        return getFileStructure('directory/path')
        .then(function (fileStructure) {
            expect(fileStructure.allFiles.length).to.equal(2);
        })
        .finally(function () {
            jsondir.dir2jsonAsync.restore();
        });
    });

    it('should record where files `require` other files:', function () {
        var jsondir = require('jsondir');
        var fileStructure = {
            'file.component.js': {
                '-path': '/some/path/file.component.js',
                '-content': 'var usage = require(\'../../some/other/path\');'
            }
        };
        sinon.stub(jsondir, 'dir2jsonAsync').returns(Promise.resolve(fileStructure));

        return getFileStructure('directory/path')
        .then(function (fileStructure) {
            expect(fileStructure.usages['/some/other/path'].length).to.equal(1);
            var usage = _.first(fileStructure.usages['/some/other/path']);
            expect(usage).to.equal('/some/path/file.component.js');
        })
        .finally(function () {
            jsondir.dir2jsonAsync.restore();
        });
    });
});
