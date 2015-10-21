/* global describe:true, it:true */
'use strict';

// Utilities:
import _ from 'lodash';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(sinonChai);

// Dependencies:
import path from 'path';

// Under test:
import getPath from './get-path';

describe('server/api: get-path:', () => {
    it('should respond to the client with a path for a new file', () => {
        let tests = [{
            type: 'components',
            expected: path.join(process.cwd(), 'e2e-tests', 'components', 'name.component.js')
        }, {
            type: 'features',
            expected: path.join(process.cwd(), 'e2e-tests', 'features', 'name.feature')
        }, {
            type: 'step-definitions',
            expected: path.join(process.cwd(), 'e2e-tests', 'step-definitions', 'name.step.js')
        }, {
            type: 'mock-data',
            expected: path.join(process.cwd(), 'e2e-tests', 'mock-data', 'name.mock.json')
        }];

        tests.forEach((test) => {
            let name = 'name';
            let { type, expected } = test;
            let request = {
                query: { name },
                params: { type }
            };
            let response = { send: _.noop };

            sinon.spy(response, 'send');

            getPath.handler(request, response);

            expect(response.send).to.have.been.calledWith({ path: expected });
        });
    });

    it('should respond to the client with a path if one is already on the request', () => {
        let itemPath = path.join('some', 'path');
        let request = {
            query: {
                path: itemPath
            },
            params: {
                type: ''
            }
        };
        let response = {
            send: _.noop
        };

        sinon.spy(response, 'send');

        getPath.handler(request, response);

        expect(response.send).to.have.been.calledWith({ path: path.join('some', 'path') });
    });
});
