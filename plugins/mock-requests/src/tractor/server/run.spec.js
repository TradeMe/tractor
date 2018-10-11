// Test setup:
import { expect, ineeda, NOOP } from '@tractor/unit-test';

// Under test:
import { run } from './run';

describe('@tractor-plugins/mock-requests - run:', () => {
    it('should read the file structure', () => {
        let mockRequestsFileStructure = ineeda({
            read: NOOP
        });

        run(mockRequestsFileStructure);

        expect(mockRequestsFileStructure.read).to.have.been.called();
    });
});
