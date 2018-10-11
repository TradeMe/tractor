// Test setup:
import { expect, ineeda } from '@tractor/unit-test';

// Dependencies:
import { server } from '@tractor/server';

// Under test:
import { start } from './index';

describe('tractor - start:', () => {
    it('should start the application', async () => {
        let di = ineeda({
            call: () => Promise.resolve()
        });

        await start(di);
        expect(di.call).to.have.been.calledWith(server);
    });
});
