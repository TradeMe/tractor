// Test setup:
import { expect, ineeda, sinon } from '@tractor/unit-test';

// Dependencies:
import * as tractorLogger from '@tractor/logger';
import { copyProtractorConfig } from './copy-protractor-config';
import { createTractorDirectory } from './create-tractor-directory';
import { initialisePlugins } from './initialise-plugins';

// Under test:
import { init } from './index';

describe('tractor - init:', () => {
    it('should run the initialisation steps', async () => {
        const di = ineeda({
            call: () => Promise.resolve()
        });

        await init(di);
        expect(di.call).to.have.been.calledWith(createTractorDirectory);
        expect(di.call).to.have.been.calledWith(copyProtractorConfig);
        expect(di.call).to.have.been.calledWith(initialisePlugins);
    });

    it('should tell the user what it is doing', async () => {
        const di = ineeda({
            call: () => Promise.resolve()
        });

        sinon.stub(tractorLogger, 'info');

        try {
            await init(di);
            expect(tractorLogger.info).to.have.been.calledWith('Setting up tractor...');
            expect(tractorLogger.info).to.have.been.calledWith('Set up complete!');
        } finally {
            tractorLogger.info.restore();
        }
    });

    it('should tell the user if there is an error', async () => {
        const di = ineeda({
            call: () => Promise.reject(new Error('error'))
        });

        sinon.stub(tractorLogger, 'error');
        sinon.stub(tractorLogger, 'info');

        try {
            await init(di);
        } catch {
            expect(tractorLogger.error).to.have.been.calledWith('Something broke, sorry 😕');
            expect(tractorLogger.error).to.have.been.calledWith('error');
        } finally {
            tractorLogger.error.restore();
            tractorLogger.info.restore();
        }
    });
});
