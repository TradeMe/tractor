/* global describe:true, it:true */
'use strict';

// Constants:
import constants from '../constants';

// Utilities:
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
import getFileStructure from './get-file-structure';
import path from 'path';
import TractorError from '../errors/TractorError';

// Under test:
import createDirectory from './create-directory';

describe('server/api: create-directory:', () => {
    it('should create a directory', () => {
        let directoryPath = path.join('some', 'path');
        let request = {
            body: {
                path: directoryPath
            }
        };

        sinon.stub(fileStructure, 'createDirectory').returns(Promise.resolve());
        sinon.stub(getFileStructure, 'handler').returns(Promise.resolve());

        return createDirectory.handler(request)
        .then(() => {
            expect(fileStructure.createDirectory).to.have.been.calledWith(path.join('some', 'path'));
        })
        .finally(() => {
            fileStructure.createDirectory.restore();
            getFileStructure.handler.restore();
        });
    });

    it('should respond to the client with the current file structure', () => {
        let directoryPath = path.join('some', 'path');
        let request = {
            body: {
                path: directoryPath
            }
        };
        let response = {};

        sinon.stub(fileStructure, 'createDirectory').returns(Promise.resolve());
        sinon.stub(getFileStructure, 'handler').returns(Promise.resolve());

        return createDirectory.handler(request, response)
        .then(() => {
            expect(getFileStructure.handler).to.have.been.calledWith(request, response);
        })
        .finally(() => {
            fileStructure.createDirectory.restore();
            getFileStructure.handler.restore();
        });
    });

    it('should handle known TractorErrors', () => {
        let directoryPath = path.join('some', 'path');
        let error = new TractorError();
        let request = {
            body: {
                path: directoryPath
            }
        };
        let response = { };

        sinon.stub(fileStructure, 'createDirectory').returns(Promise.reject(error));
        sinon.stub(errorHandler, 'handler');

        return createDirectory.handler(request, response)
        .then(() => {
            expect(errorHandler.handler).to.have.been.calledWith(response, error);
        })
        .finally(() => {
            fileStructure.createDirectory.restore();
            errorHandler.handler.restore();
        });
    });

    it('should handle unknown errors', () => {
        let directoryPath = path.join('some', 'path');
        let error = new Error();
        let request = {
            body: {
                path: directoryPath
            }
        };
        let response = { };

        sinon.stub(fileStructure, 'createDirectory').returns(Promise.reject(error));
        sinon.stub(errorHandler, 'handler');

        return createDirectory.handler(request, response)
        .then(() => {
            expect(errorHandler.handler).to.have.been.calledWith(response, new TractorError('Could not create directory', constants.SERVER_ERROR));
        })
        .finally(() => {
            fileStructure.createDirectory.restore();
            errorHandler.handler.restore();
        });
    });
});
