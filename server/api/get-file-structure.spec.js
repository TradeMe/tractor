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
var getFileStructure;

// Mocks:
var featureLexerMock = require('../utils/feature-lexer.mock');
var fileStructureModifierMock = require('../utils/file-structure-modifier.mock');
var revert;

describe('server/api: get-file-structure:', function () {
    beforeEach(function () {
        getFileStructure = rewire('./get-file-structure');
        /* eslint-disable no-underscore-dangle */
        revert = getFileStructure.__set__({
            featureLexer: featureLexerMock,
            fileStructureModifier: fileStructureModifierMock
        });
        /* eslint-enable no-underscore-dangle */
    });

    afterEach(function () {
        revert();
    });

    it('should lex all the feature files:', function () {
        var fileStructure = {
            allFiles: [{
                path: 'test1.feature'
            }, {
                path: 'test2.feature'
            }, {
                path: 'test3.notFeature'
            }]
        };

        sinon.stub(fileStructureModifierMock, 'create', function (options) {
            return options.preSend;
        });
        sinon.stub(featureLexerMock, 'lex');

        getFileStructure = getFileStructure();
        getFileStructure(fileStructure);

        expect(featureLexerMock.lex.callCount).to.equal(2);

        fileStructureModifierMock.create.restore();
        featureLexerMock.lex.restore();
    });
});
