/* global describe:true, it:true */

// Utilities:
import chai from 'chai';
import Promise from 'bluebird';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(sinonChai);

// Dependencies:
import fs from 'graceful-fs';
import path from 'path';
import * as tractorLogger from 'tractor-logger';

// Under test:
import { createTractorDirectoryStructure } from './create-tractor-directory-structure';

describe('tractor - init/create-tractor-directory-structure:', () => {
    it('should create the tractor directory structure', () => {
        sinon.stub(fs, 'mkdirAsync').returns(Promise.resolve());
        sinon.stub(tractorLogger, 'info');
        sinon.stub(tractorLogger, 'warn');

        return createTractorDirectoryStructure({
            directory: './directory',
            features: {
                directory: './directory/features'
            },
            pageObjects: {
                directory: './directory/page-objects'
            },
            stepDefinitions: {
                directory: './directory/step-definitions'
            },
        })
        .then(() => {
            expect(fs.mkdirAsync).to.have.been.calledWith('directory');
            expect(fs.mkdirAsync).to.have.been.calledWith(path.join('directory', 'report'));
            expect(fs.mkdirAsync).to.have.been.calledWith(path.join('directory', 'support'));
            expect(fs.mkdirAsync).to.have.been.calledWith(path.join('directory', 'features'));
            expect(fs.mkdirAsync).to.have.been.calledWith(path.join('directory', 'page-objects'));
            expect(fs.mkdirAsync).to.have.been.calledWith(path.join('directory', 'step-definitions'));
        })
        .finally(() => {
            fs.mkdirAsync.restore();
            tractorLogger.info.restore();
            tractorLogger.warn.restore();
        });
    });

    it('should tell the user if the directory already exists', () => {
        let error = new Promise.OperationalError();
        error.cause = {
            code: 'EEXIST'
        };
        sinon.stub(fs, 'mkdirAsync').returns(Promise.reject(error));
        sinon.stub(tractorLogger, 'info');
        sinon.stub(tractorLogger, 'warn');

        return createTractorDirectoryStructure({
            directory: 'directory',
            features: {
                directory: './directory/features'
            },
            pageObjects: {
                directory: './directory/page-objects'
            },
            stepDefinitions: {
                directory: './directory/step-definitions'
            },
        })
        .then(() => {
            expect(tractorLogger.warn).to.have.been.calledWith('"directory" directory already exists. Moving on...');
        })
        .finally(() => {
            fs.mkdirAsync.restore();
            tractorLogger.info.restore();
            tractorLogger.warn.restore();
        });
    });

    it('should rethrow any other errors', () => {
        sinon.stub(fs, 'mkdirAsync').returns(Promise.reject(new Promise.OperationalError()));
        sinon.stub(tractorLogger, 'info');
        sinon.stub(tractorLogger, 'warn');

        return createTractorDirectoryStructure({
            directory: 'directory',
            features: {
                directory: './directory/features'
            },
            pageObjects: {
                directory: './directory/page-objects'
            },
            stepDefinitions: {
                directory: './directory/step-definitions'
            },
        })
        .catch(() => {})
        .then(() => {
            expect(tractorLogger.warn).to.not.have.been.called();
        })
        .finally(() => {
            fs.mkdirAsync.restore();
            tractorLogger.info.restore();
            tractorLogger.warn.restore();
        });
    });

    it('should tell the user what it is doing', () => {
        sinon.stub(fs, 'mkdirAsync').returns(Promise.resolve());
        sinon.stub(tractorLogger, 'info');
        sinon.stub(tractorLogger, 'warn');

        return createTractorDirectoryStructure({
            directory: 'directory',
            features: {
                directory: './directory/features'
            },
            pageObjects: {
                directory: './directory/page-objects'
            },
            stepDefinitions: {
                directory: './directory/step-definitions'
            },
        })
        .then(() => {
            expect(tractorLogger.info).to.have.been.calledWith('Creating directory structure...');
            expect(tractorLogger.info).to.have.been.calledWith('Directory structure created.');
        })
        .finally(() => {
            fs.mkdirAsync.restore();
            tractorLogger.info.restore();
            tractorLogger.warn.restore();
        });
    });
});
