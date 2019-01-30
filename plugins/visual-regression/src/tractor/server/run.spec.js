// Test setup:
import { expect, ineeda, NOOP } from '@tractor/unit-test';

// Under test:
import { run } from './run';

describe('@tractor-plugins/visual-regression - run:', () => {
    it('should read the file structure', () => {
        let visualRegressionFileStructure = ineeda({
            read: NOOP
        });

        run(visualRegressionFileStructure);

        expect(visualRegressionFileStructure.read.callCount > 0).to.equal(true);
    });
});
