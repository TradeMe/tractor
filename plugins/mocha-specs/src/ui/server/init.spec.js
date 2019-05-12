// Test setup:
import { expect, sinon } from '@tractor/unit-test';

// Dependencies:
import * as tractorFileStructure from '@tractor/file-structure';

// Under test:
import { init } from './init';

describe('@tractor-plugin/mocha-specs - init:', () => {
    it.skip('should create the mocha specs directory if it is missing', async () => {
        sinon.stub(process, 'cwd').returns('');
        sinon.stub(tractorFileStructure, 'createDirIfMissing').resolves();

        await init({
            mochaSpecs: {
                directory: './tractor/mocha-specs',
                reportsDirectory: './tractor/reports'
            }
        });

        expect(tractorFileStructure.createDirIfMissing).to.have.been.calledWith('/tractor/mocha-specs');

        process.cwd.restore();
        tractorFileStructure.createDirIfMissing.restore();
    });

    it.skip('should create the reports directory if it is missing', async () => {
        sinon.stub(process, 'cwd').returns('');
        sinon.stub(tractorFileStructure, 'createDirIfMissing').resolves();

        await init({
            mochaSpecs: {
                directory: './tractor/mocha-specs',
                reportsDirectory: './tractor/reports'
            }
        });

        expect(tractorFileStructure.createDirIfMissing).to.have.been.calledWith('/tractor/reports');

        process.cwd.restore();
        tractorFileStructure.createDirIfMissing.restore();
    });
});
