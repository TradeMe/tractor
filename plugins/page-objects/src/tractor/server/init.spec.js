// Test setup:
import { expect, sinon } from '@tractor/unit-test';

// Dependencies:
import { TractorError } from '@tractor/error-handler';
import * as tractorFileStructure from '@tractor/file-structure';
import * as tractorLogger from '@tractor/logger';

// Under test:
import { init } from './init';

describe('@tractor-plugins/page-objects - init:', () => {
    it.skip('should create the page-objects directory', () => {
        sinon.stub(tractorFileStructure, 'createDirIfMissing').resolves();

        return init({
            directory: './tractor',
            pageObjects: {
                directory: './tractor/page-objects'
            }
        })
        .then(() => {
            expect(tractorFileStructure.createDir).to.have.been.calledWith('/tractor/page-objects');
        })
        .finally(() => {
            tractorFileStructure.createDir.restore();
        });
    });

    it.skip('should tell the user if the directory already exists', () => {
        sinon.stub(tractorFileStructure, 'createDirIfMissing').rejects(new TractorError('"/tractor/page-objects" already exists.'));
        sinon.stub(tractorLogger, 'warn');

        return init({
            directory: './tractor',
            pageObjects: {
                directory: './tractor/page-objects'
            }
        })
        .then(() => {
            expect(tractorLogger.warn).to.have.been.calledWith('"/tractor/page-objects" already exists. Moving on...');
        })
        .finally(() => {
            tractorFileStructure.createDir.restore();
            tractorLogger.warn.restore();
        });
    });
});
