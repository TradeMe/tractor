// Test setup:
import { expect, sinon } from '@tractor/unit-test';

// Dependencies:
import path from 'path';
import * as tractorFileStructure from '@tractor/file-structure';
import * as tractorLogger from '@tractor/logger';

// Errors:
import { TractorError } from '@tractor/error-handler';

// Under test:
import { copyProtractorConfig } from './copy-protractor-config';

describe('tractor - copy-protractor-config:', () => {
    it.skip('should copy the "protractor.conf.js" file to the users specified directory', async () => {
        sinon.stub(tractorFileStructure, 'copyFile').resolves();

        try {
            await copyProtractorConfig({
                directory: ''
            });
            const readPath = path.join(__dirname, 'base-file-sources', 'protractor.conf.js');
            const writePath = path.join(process.cwd(), 'protractor.conf.js');
            expect(tractorFileStructure.copyFile).to.have.been.calledWith(readPath, writePath);
        } finally {
            tractorFileStructure.copyFile.restore();
        }
    });

    it.skip('should tell the user if "protractor.conf.js" already exists', async () => {
        sinon.stub(tractorFileStructure, 'copyFile').rejects(new TractorError('"protractor.conf.js" already exists.'));
        sinon.stub(tractorLogger, 'warn');

        try {
            await copyProtractorConfig({
                directory: ''
            });
            expect(tractorLogger.warn).to.have.been.calledWith('"protractor.conf.js" already exists. Not copying...');
        } finally {
            tractorFileStructure.copyFile.restore();
            tractorLogger.warn.restore();
        }
    });
});
