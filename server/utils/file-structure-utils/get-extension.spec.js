/* global describe:true, it:true */
'use strict';

// Test Utilities:
var chai = require('chai');
var expect = chai.expect;

// Under test:
var getExtension = require('./get-extension');

describe('server/utils/file-structure-utils: get-extension:', function () {
    var path = require('path');

    it('should find ".component.js" for a path within the "components" directory', function () {
        expect(getExtension(path.join('components', 'some', 'file', 'path'))).to.equal('.component.js');
    });

    it('should find ".feature" for a path within the "features" directory', function () {
        expect(getExtension(path.join('features', 'some', 'file', 'path'))).to.equal('.feature');
    });

    it('should find ".step.js" for a path within the "step_definitions" directory', function () {
        expect(getExtension(path.join('step_definitions', 'some', 'file', 'path'))).to.equal('.step.js');
    });

    it('should find ".mock.json" for a path within the "mock_data" directory', function () {
        expect(getExtension(path.join('mock_data', 'some', 'file', 'path'))).to.equal('.mock.json');
    });
});
