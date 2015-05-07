/* global describe:true, it:true */
'use strict';

// Test Utilities:
var chai = require('chai');
var expect = chai.expect;

// Under test:
var findFile = require('./find-file');

describe('server/utils/file-structure-utils/: find-filer:', function () {
    it('should find a file in a given directory:', function () {
        var directory = {
            allFiles: [{
                path: 'path-to-find'
            }]
        };

        var file = findFile(directory, 'path-to-find');
        expect(file).not.to.be.undefined();
    });
});
