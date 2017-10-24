/* global describe:true, it:true */

// Test setup:
import { expect, ineeda, NOOP, sinon } from '../../../test-setup';

// Dependencies:
import { FileStructure } from 'tractor-file-structure';
import * as getDiffs from './actions/get-diffs';
import * as takeChanges from './actions/take-changes';
import { DiffPNGFile } from './files/diff-png-file';
import { PNGFile } from './files/png-file';

// Under test:
import { serve } from './serve';

describe('tractor-plugin-visual-regression - serve:', () => {
    it('should create a new FileStructure', () => {
        let visualRegressionFileStructure = null;

        let application = ineeda();
        let config = {
            visualRegression: {
                directory: './tractor/visual-regression'
            }
        };
        let di = ineeda({
            call: () => NOOP,
            constant: constants => {
                visualRegressionFileStructure = constants.visualRegressionFileStructure;
            }
        });

        serve(application, config, di);

        expect(visualRegressionFileStructure).to.be.an.instanceof(FileStructure);
    });

    it('should add the FileStructure to the DI container', () => {
        let application = ineeda();
        let config = {
            visualRegression: {
                directory: './tractor/visual-regression'
            }
        };
        let di = ineeda({
            call: () => NOOP
        });

        serve(application, config, di);

        expect(di.constant).to.have.been.called();
    });

    it('should add the DiffPNGFile type to the FileStructure', () => {
        let application = ineeda();
        let config = {
            visualRegression: {
                directory: './tractor/visual-regression'
            }
        };
        let di = ineeda({
            call: () => NOOP
        });

        sinon.stub(FileStructure.prototype, 'addFileType');

        serve(application, config, di);

        expect(FileStructure.prototype.addFileType).to.have.been.calledWith(DiffPNGFile);

        FileStructure.prototype.addFileType.restore();
    });

    it('should add the PNGFile type to the FileStructure', () => {
        let application = ineeda();
        let config = {
            visualRegression: {
                directory: './tractor/visual-regression'
            }
        };
        let di = ineeda({
            call: () => NOOP
        });

        sinon.stub(FileStructure.prototype, 'addFileType');

        serve(application, config, di);

        expect(FileStructure.prototype.addFileType).to.have.been.calledWith(PNGFile);

        FileStructure.prototype.addFileType.restore();
    });

    it('should add a "get-diffs" endpoint', () => {
        let application = ineeda();
        let config = {
            visualRegression: {
                directory: './tractor/visual-regression'
            }
        };
        let di = ineeda({
            call: () => NOOP
        });
        let handler = () => {};

        sinon.stub(getDiffs, 'createGetDiffsHandler').returns(handler);
        sinon.stub(takeChanges, 'createTakeChangesHandler');

        serve(application, config, di);

        expect(application.get).to.have.been.calledWith('/visual-regression/get-diffs', handler);

        getDiffs.createGetDiffsHandler.restore();
        takeChanges.createTakeChangesHandler.restore();
    });

    it('should add a "take-changes" endpoint', () => {
        let application = ineeda();
        let config = {
            visualRegression: {
                directory: './tractor/visual-regression'
            }
        };
        let di = ineeda({
            call: () => NOOP
        });
        let handler = () => {};

        sinon.stub(getDiffs, 'createGetDiffsHandler');
        sinon.stub(takeChanges, 'createTakeChangesHandler').returns(handler);

        serve(application, config, di);

        expect(application.put).to.have.been.calledWith('/visual-regression/take-changes', handler);

        getDiffs.createGetDiffsHandler.restore();
        takeChanges.createTakeChangesHandler.restore();
    });
});
