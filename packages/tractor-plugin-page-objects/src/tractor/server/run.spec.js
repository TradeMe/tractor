/* global describe:true, it:true */

// Test setup:
import { expect, ineeda, NOOP } from '../../../test-setup';

// Under test:
import { run } from './run';

describe('tractor-plugin-page-objects - run:', () => {
    it('should read the file structure', () => {
        let pageObjectsFileStructure = ineeda({
            read: NOOP
        });

        run(pageObjectsFileStructure);

        expect(pageObjectsFileStructure.read).to.have.been.called();
    });
});
