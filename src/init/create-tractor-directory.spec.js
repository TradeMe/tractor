/* global describe:true, xit:true */

// Test setup:
import { expect, Promise, sinon } from '../../test-setup';

// Dependencies:
import * as tractorFileStructure from 'tractor-file-structure';
import * as tractorLogger from 'tractor-logger';

// Errors:
import { TractorError } from 'tractor-error-handler';

// Under test:
import { createTractorDirectory } from './create-tractor-directory';

describe('tractor - create-tractor-directory:', () => {
    xit('should create the tractor directory', () => {
        sinon.stub(tractorFileStructure, 'createDir').returns(Promise.resolve());

        return createTractorDirectory({
            directory: './directory'
        })
        .then(() => {
            expect(tractorFileStructure.createDir).to.have.been.calledWith('directory');
        })
        .finally(() => {
            tractorFileStructure.createDir.restore();
        });
    });

    xit('should tell the user if the directory already exists', () => {
        sinon.stub(tractorFileStructure, 'createDir').returns(Promise.reject(new TractorError('"directory" already exists.')));
        sinon.stub(tractorLogger, 'warn');

        return createTractorDirectory({
            directory: 'directory'
        })
        .then(() => {
            expect(tractorLogger.warn).to.have.been.calledWith('"directory" already exists. Moving on...');
        })
        .finally(() => {
            tractorFileStructure.createDir.restore();
            tractorLogger.warn.restore();
        });
    });
});
