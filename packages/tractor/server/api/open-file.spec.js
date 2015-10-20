/* global describe:true, it:true */
'use strict';

// Utilities:
import _ from 'lodash';
import chai from 'chai';
import Promise from 'bluebird';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(sinonChai);

// Dependencies:
import errorHandler from '../errors/error-handler';
import fileStructure from '../file-structure';
import TractorError from '../errors/TractorError';

// Under test:
import openFile from './open-file';

describe('server/api: open-file:', () => {
    it('should open a file', () => {
        let path = 'some/path';
        let request = {
            query: { path }
        };
        let response = {
            send: _.noop
        };

        sinon.stub(fileStructure, 'openFile').returns(Promise.resolve());
        sinon.stub(response, 'send');

        return openFile.handler(request, response)
        .then(() => {
            expect(fileStructure.openFile).to.have.been.calledWith(path);
        })
        .finally(() => {
            fileStructure.openFile.restore();
        });
    });

    it('should respond to the client with the file', () => {
        let file = {};
        let path = 'some/path';
        let request = {
            query: { path }
        };
        let response = {
            send: _.noop
        };

        sinon.stub(fileStructure, 'openFile').returns(Promise.resolve(file));
        sinon.stub(response, 'send');

        return openFile.handler(request, response)
        .then(() => {
            expect(response.send).to.have.been.calledWith(file);
        })
        .finally(() => {
            fileStructure.openFile.restore();
        });
    });

    it('should handle known TractorErrors', () => {
        let error = new TractorError();
        let path = 'some/path';
        let request = {
            query: { path }
        };
        let response = {
            send: _.noop
        };

        sinon.stub(fileStructure, 'openFile').returns(Promise.reject(error));
        sinon.stub(errorHandler, 'handler');

        return openFile.handler(request, response)
        .then(() => {
            expect(errorHandler.handler).to.have.been.calledWith(response, error);
        })
        .finally(() => {
            fileStructure.openFile.restore();
            errorHandler.handler.restore();
        });
    });

    it('should handle unknown errors', () => {
        let error = new Error();
        let path = 'some/path';
        let request = {
            query: { path }
        };
        let response = {
            send: _.noop
        };

        sinon.stub(fileStructure, 'openFile').returns(Promise.reject(error));
        sinon.stub(errorHandler, 'handler');

        return openFile.handler(request, response)
        .then(() => {
            expect(errorHandler.handler).to.have.been.calledWith(response, new TractorError('Could not open "some/path"', 500));
        })
        .finally(() => {
            fileStructure.openFile.restore();
            errorHandler.handler.restore();
        });
    });
});
