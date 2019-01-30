// Test setup:
import { expect, ineeda } from '@tractor/unit-test';

// Under test:
import { run } from './run';

describe('@tractor-plugins/page-objects - run:', () => {
    it('should read the file structure', async () => {
        let pageObjectsFileStructure = ineeda({
            referenceManager: ineeda()
        });
        let includeFileStructure1 = ineeda();
        let includeFileStructure2 = ineeda();
        let includeFileStructures = [includeFileStructure1, includeFileStructure2];

        await run(pageObjectsFileStructure, includeFileStructures);

        expect(includeFileStructure1.read.callCount > 0).to.equal(true);
        expect(includeFileStructure2.read.callCount > 0).to.equal(true);
        expect(pageObjectsFileStructure.read.callCount > 0).to.equal(true);
    });
});
