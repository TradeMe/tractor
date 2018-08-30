// Test setup:
import { expect, Promise, sinon } from '@tractor/unit-test';

// Dependencies:
import { TractorError } from '@tractor/error-handler';
import * as tractorFileStructure from '@tractor/file-structure';
import * as tractorLogger from '@tractor/logger';

// Under test:
import { init } from './init';

describe('@tractor-plugins/mock-requests - init:', () => {
    xit('should create the mock-requests directory', () => {
        sinon.stub(tractorFileStructure, 'createDir').returns(Promise.resolve());

        return init({
            directory: './tractor'
        })
        .then(() => {
            expect(tractorFileStructure.createDir).to.have.been.calledWith('/tractor/mock-requests');
        })
        .finally(() => {
            tractorFileStructure.createDir.restore();
        });
    });

    xit('should tell the user if the directory already exists', () => {
        sinon.stub(tractorFileStructure, 'createDir').returns(Promise.reject(new TractorError('"/tractor/mock-requests" already exists.')));
        sinon.stub(tractorLogger, 'warn');

        return init({
            directory: './tractor'
        })
        .then(() => {
            expect(tractorLogger.warn).to.have.been.calledWith('"/tractor/mock-requests" already exists. Moving on...');
        })
        .finally(() => {
            tractorFileStructure.createDir.restore();
            tractorLogger.warn.restore();
        });
    });
});
