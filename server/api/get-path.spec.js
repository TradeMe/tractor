/* global describe:true, it:true */
'use strict';

// Test utilities:
var chai = require('chai');
var dirtyChai = require('dirty-chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

// Utilities:
var _ = require('lodash');

// Test setup:
var expect = chai.expect;
chai.use(dirtyChai);
chai.use(sinonChai);

// Under test:
var getPath = require('./get-path');

describe('server/api: get-path:', function () {
    it('should create a path for a new file:', function () {
        var path = require('path');
        var tests = [{
            type: 'components',
            expected: path.join(process.cwd(), 'e2e_tests', 'components', 'name.component.js')
        }, {
            type: 'features',
            expected: path.join(process.cwd(), 'e2e_tests', 'features', 'name.feature')
        }, {
            type: 'step_definitions',
            expected: path.join(process.cwd(), 'e2e_tests', 'step_definitions', 'name.step.js')
        }, {
            type: 'mock_data',
            expected: path.join(process.cwd(), 'e2e_tests', 'mock_data', 'name.mock.json')
        }];

        tests.forEach(function (test) {
            var request = {
                query: {
                    name: 'name'
                },
                params: {
                    type: test.type
                }
            };
            var response = {
                send: _.noop
            };
            sinon.spy(response, 'send');

            getPath(request, response);

            var responseData = JSON.parse(response.send.firstCall.args[0]);
            expect(responseData.path).to.equal(test.expected);
        });

    });

    it('should return a path if one is already on the request:', function () {
        var request = {
            query: {
                path: 'some/path'
            },
            params: {
                type: ''
            }
        };
        var response = {
            send: _.noop
        };
        sinon.spy(response, 'send');

        getPath(request, response);

        var responseData = JSON.parse(response.send.firstCall.args[0]);
        expect(responseData.path).to.equal('some/path');
    });
});
