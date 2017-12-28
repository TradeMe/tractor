/* global describe:true, xit:true */

// Test setup:
import { expect, sinon } from '../../test-setup';

// Dependencies:
import path from 'path';
import * as tractorFileStructure from 'tractor-file-structure';
import * as tractorLogger from 'tractor-logger';

// Errors:
import { TractorError } from 'tractor-error-handler';

// Under test:
import { copyProtractorConfig } from './copy-protractor-config';

describe('tractor - copy-protractor-config:', () => {
    xit('should copy the "protractor.conf.js" file to the users specified directory', () => {
        sinon.stub(tractorFileStructure, 'copyFile').resolves();

        return copyProtractorConfig({
            directory: ''
        })
        .then(() => {
            let readPath = path.join(__dirname, 'base-file-sources', 'protractor.conf.js');
            let writePath = path.join(process.cwd(), 'protractor.conf.js');
            expect(tractorFileStructure.copyFile).to.have.been.calledWith(readPath, writePath);
        })
        .finally(() => {
            tractorFileStructure.copyFile.restore();
        });
    });

    xit('should tell the user if "protractor.conf.js" already exists', () => {
        sinon.stub(tractorFileStructure, 'copyFile').rejects((new TractorError('"protractor.conf.js" already exists.')));
        sinon.stub(tractorLogger, 'warn');

        return copyProtractorConfig({
            directory: ''
        })
        .then(() => {
            expect(tractorLogger.warn).to.have.been.calledWith('"protractor.conf.js" already exists. Not copying...');
        })
        .finally(() => {
            tractorFileStructure.copyFile.restore();
            tractorLogger.warn.restore();
        });
    });
});
