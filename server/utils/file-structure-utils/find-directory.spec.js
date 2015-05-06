/* global describe:true, it:true */
'use strict';

// Utilities:
var _ = require('lodash');

// Test Utilities:
var chai = require('chai');
var expect = chai.expect;

// Under test:
var findDirectory = require('./find-directory');

describe('server/utils/file-structure-utils: find-directory:', function () {
    it('should find a directory by the given path at varying depths:', function () {
        var tests = [{
            structure: {
                path: 'path-to-find'
            }
        }, {
            structure: {
                directories: [{
                    path: 'path-to-find'
                }, {
                    path: 'not-path-to-find'
                }]
            }
        }, {
            structure: {
                directories: [{
                    directories: [{
                        path: 'path-to-find'
                    }]
                }]
            }
        }];

        _.each(tests, function (test) {
            var directory = findDirectory(test.structure, 'path-to-find');
            expect(directory).not.to.be.undefined();
        });
    });
});
