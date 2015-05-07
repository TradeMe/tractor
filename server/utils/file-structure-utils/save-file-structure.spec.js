/* global describe:true, beforeEach:true, afterEach:true, it:true */
'use strict';

// Test Utilities:
var chai = require('chai');
var rewire = require('rewire');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

// Test setup:
var expect = chai.expect;
chai.use(sinonChai);

// Under test:
var saveFileStructure;

// Mocks:
var javascriptGeneratorMock = require('../javascript-generator.mock');
var revert;

describe('server/api: save-file-structure:', function () {
    beforeEach(function () {
        saveFileStructure = rewire('./save-file-structure');
        /* eslint-disable no-underscore-dangle */
        revert = saveFileStructure.__set__({
            javascriptGenerator: javascriptGeneratorMock
        });
        /* eslint-enable no-underscore-dangle */
    });

    afterEach(function () {
        revert();
    });
});
