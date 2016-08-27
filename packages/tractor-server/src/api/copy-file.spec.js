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
import copyFile from './copy-file';

describe('server/api: copy-file:', () => {
    it('should copy a file', () => {
        let filePath = path.join('some', 'path');
        let request = {
            body: {
                path: filePath
            }
        };

        sinon.stub(fileStructure, 'copyFile').returns(Promise.resolve());
        sinon.stub(getFileStructure, 'handler').returns(Promise.resolve());

        return copyFile.handler(request)
        .then(() => {
            expect(fileStructure.copyFile).to.have.been.calledWith(path.join('some', 'path'));
        })
        .finally(() => {
            fileStructure.copyFile.restore();
            getFileStructure.handler.restore();
        });
    });

    it('should respond to the client with the current file structure', () => {
        let filePath = path.join('some', 'path');
        let request = {
            body: {
                path: filePath
            }
        };
        let response = {};

        sinon.stub(fileStructure, 'copyFile').returns(Promise.resolve());
        sinon.stub(getFileStructure, 'handler').returns(Promise.resolve());

        return copyFile.handler(request, response)
        .then(() => {
            expect(getFileStructure.handler).to.have.been.calledWith(request, response);
        })
        .finally(() => {
            fileStructure.copyFile.restore();
            getFileStructure.handler.restore();
        });
    });

    it('should handle known TractorErrors', () => {
        let error = new TractorError();
        let filePath = path.join('some', 'path');
        let request = {
            body: {
                path: filePath
            }
        };
        let response = { };

        sinon.stub(fileStructure, 'copyFile').returns(Promise.reject(error));
        sinon.stub(errorHandler, 'handler');

        return copyFile.handler(request, response)
        .then(() => {
            expect(errorHandler.handler).to.have.been.calledWith(response, error);
        })
        .finally(() => {
            fileStructure.copyFile.restore();
            errorHandler.handler.restore();
        });
    });

    it('should handle unknown errors', () => {
        let error = new Error();
        let filePath = path.join('some', 'path');
        let request = {
            body: {
                path: filePath
            }
        };
        let response = { };

        sinon.stub(fileStructure, 'copyFile').returns(Promise.reject(error));
        sinon.stub(errorHandler, 'handler');

        return copyFile.handler(request, response)
        .then(() => {
            expect(errorHandler.handler).to.have.been.calledWith(response, new TractorError(`Could not copy "${path.join('some', 'path')}"`, constants.SERVER_ERROR));
        })
        .finally(() => {
            fileStructure.copyFile.restore();
            errorHandler.handler.restore();
        });
    });
});
