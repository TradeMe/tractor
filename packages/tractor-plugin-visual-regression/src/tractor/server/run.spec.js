/* global describe:true, it:true */

// Test setup:
import { expect, ineeda, NOOP } from '../../../test-setup';

// Under test:
import { run } from './run';

describe('tractor-plugin-visual-regression - run:', () => {
    it('should read the file structure', () => {
        let visualRegressionFileStructure = ineeda({
            read: NOOP
        });

        run(visualRegressionFileStructure);

        expect(visualRegressionFileStructure.read).to.have.been.called();
    });
});
