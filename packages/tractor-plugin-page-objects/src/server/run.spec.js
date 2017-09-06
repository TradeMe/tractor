/* global describe:true, it:true */

// Test setup:
import { expect, sinon } from '../../test-setup';

// Under test:
import run from './run';

describe('tractor-plugin-page-objects - run:', () => {
    it('should read the file structure', () => {
        let pageObjectsFileStructure = {
            read: () => {}
        }

        sinon.stub(pageObjectsFileStructure, 'read');

        run(pageObjectsFileStructure);

        expect(pageObjectsFileStructure.read).to.have.been.called();
    });
});
