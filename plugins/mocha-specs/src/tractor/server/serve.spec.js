/* global describe:true, it:true */

// Test setup:
import { expect, ineeda, NOOP, sinon } from '@tractor/unit-test';

// Dependencies:
import { FileStructure } from '@tractor/file-structure';
import { MochaSpecFile } from './files/mocha-spec-file';

// Under test:
import { serve } from './serve';

describe('@tractor-plugins/mocha-specs - serve:', () => {
    it('should create a new FileStructure', () => {
        let mochaSpecsFileStructure = null;
        let config = {
            mochaSpecs: {
                directory: './tractor/mocha-specs'
            }
        };
        let di = ineeda({
            call: () => NOOP,
            constant: constants => {
                mochaSpecsFileStructure = constants.mochaSpecsFileStructure;
            }
        });

        serve(config, di);

        expect(mochaSpecsFileStructure).to.be.an.instanceof(FileStructure);
    });

    it('should add the FileStructure to the DI container', () => {
        let config = {
            mochaSpecs: {
                directory: './tractor/mocha-specs'
            }
        };
        let di = ineeda({
            call: () => NOOP,
            constant: NOOP
        });

        serve(config, di);

        expect(di.constant.callCount > 0).to.equal(true);
    });

    it('should add the MochaSpecFile type to the FileStructure', () => {
        let config = {
            mochaSpecs: {
                directory: './tractor/mocha-specs'
            }
        };
        let di = ineeda({
            call: () => NOOP,
            constant: NOOP
        });

        sinon.stub(FileStructure.prototype, 'addFileType');

        serve(config, di);

        expect(FileStructure.prototype.addFileType).to.have.been.calledWith(MochaSpecFile);

        FileStructure.prototype.addFileType.restore();
    });
});
