/* global describe:true, beforeEach:true, it:true */
'use strict';

// Test Utilities:
var chai = require('chai');
var dirtyChai = require('dirty-chai');
var rewire = require('rewire');

// Test setup:
var expect = chai.expect;
chai.use(dirtyChai);

// Under test:
var createConfig;

describe('server/utils: create-config:', function () {
    beforeEach(function () {
        createConfig = rewire('./create-config');
    });

    it('returns the default config when there is not a `tractor.conf.js` file', function () {
        /* eslint-disable no-underscore-dangle */
        var revert = createConfig.__set__({
            path: {
                join: function () {
                    return '';
                }
            }
        });
        /* eslint-enable no-underscore-dangle */
        var config = createConfig();

        expect(config.testDirectory).to.equal('./e2e_tests');
        expect(config.port).to.equal(4000);

        revert();
    });

    it('returns the custom values from a `tractor.conf.js` file', function () {
        /* eslint-disable no-underscore-dangle */
        var revert = createConfig.__set__({
            require: function () {
                return {
                    testDirectory: './tests'
                };
            }
        });
        /* eslint-enable no-underscore-dangle */
        var config = createConfig();

        expect(config.testDirectory).to.equal('./tests');

        revert();
    });

    it('returns default values for properties that are not overridden by the user', function () {
        /* eslint-disable no-underscore-dangle */
        var revert = createConfig.__set__({
            require: function () {
                return {
                    testDirectory: './tests'
                };
            }
        });
        /* eslint-enable no-underscore-dangle */
        var config = createConfig();

        expect(config.port).to.equal(4000);

        revert();
    });
});
