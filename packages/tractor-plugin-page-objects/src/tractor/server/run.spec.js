/* global describe:true, it:true */

// Test setup:
import { expect, ineeda, NOOP } from '@tractor/unit-test';

// Under test:
import { run } from './run';

describe('@tractor-plugin/page-objects - run:', () => {
    it('should read the file structure', () => {
        let pageObjectsFileStructure = ineeda({
            read: NOOP
        });
        let includeFileStructures = [ineeda({
            read: NOOP
        })];

        run(pageObjectsFileStructure, includeFileStructures);

        expect(pageObjectsFileStructure.read).to.have.been.called();
    });
});
