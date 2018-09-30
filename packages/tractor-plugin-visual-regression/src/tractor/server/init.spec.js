// Dependencies:
import path from 'path';
import { TractorError } from '@tractor/error-handler';
import * as tractorFileStructure from '@tractor/file-structure';
import * as tractorLogger from '@tractor/logger';

// Test setup:
import { expect, sinon } from '@tractor/unit-test';

// Under test:
import { init } from './init';

describe('@tractor-plugins/visual-regression - init:', () => {
    it.skip('should create the visual regression file structure', async () => {
        let config = {};

        sinon.stub(process, 'cwd').returns(path.sep);
        sinon.stub(tractorFileStructure, 'createDir').returns(Promise.resolve());

        await init(config);

        expect(tractorFileStructure.createDir).to.have.been.calledWith('/tractor/visual-regression');
        expect(tractorFileStructure.createDir).to.have.been.calledWith('/tractor/visual-regression/baseline');
        expect(tractorFileStructure.createDir).to.have.been.calledWith('/tractor/visual-regression/changes');
        expect(tractorFileStructure.createDir).to.have.been.calledWith('/tractor/visual-regression/diffs');

        process.cwd.restore();
        tractorFileStructure.createDir.restore();
    });

    it.skip('should handle the error when a directory already exists', async () => {
        let config = {};

        sinon.stub(process, 'cwd').returns(path.sep);
        sinon.stub(tractorFileStructure, 'createDir').returns(Promise.reject(new TractorError('"/tractor/visual-regression" already exists.')));
        sinon.stub(tractorLogger, 'warn');

        await init(config);

        expect(tractorLogger.warn).to.have.been.calledWith('"/tractor/visual-regression" already exists. Moving on...');

        process.cwd.restore();
        tractorFileStructure.createDir.restore();
        tractorLogger.warn.restore();
    });

    it.skip('should throw any other errors', async () => {
        let config = {};
        let error = new Error();

        sinon.stub(process, 'cwd').returns(path.sep);
        sinon.stub(tractorFileStructure, 'createDir').returns(Promise.reject(error));

        try {
            await init(config);
        } catch(e) {
            expect(e).to.equal(error);
        }

        process.cwd.restore();
        tractorFileStructure.createDir.restore();
    });
});
