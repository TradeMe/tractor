/* global describe:true, it:true */

// Test setup:
import { expect, ineeda, NOOP } from '../../../test-setup';

// Under test:
import { run } from './run';

describe('tractor-plugin-mock-requests - run:', () => {
    it('should read the file structure', () => {
        let mockRequestsFileStructure = ineeda({
            read: NOOP
        });

        run(mockRequestsFileStructure);

        expect(mockRequestsFileStructure.read).to.have.been.called();
    });
});
