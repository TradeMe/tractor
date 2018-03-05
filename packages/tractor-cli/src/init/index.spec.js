// Test setup:
import { expect, ineeda, NOOP, Promise, sinon } from '@tractor/unit-test';

// Dependencies:
import * as tractorLogger from '@tractor/logger';
import { copyProtractorConfig } from './copy-protractor-config';
import { createTractorDirectory } from './create-tractor-directory';
import { initialisePlugins } from './initialise-plugins';

// Under test:
import { init } from './index';

describe('tractor - init:', () => {
    it('should run the initialisation steps', () => {
        let di = ineeda({
            call: () => Promise.resolve()
        });

        sinon.stub(tractorLogger, 'info');

        return init(di)
        .then(() => {
            expect(di.call).to.have.been.calledWith(createTractorDirectory);
            expect(di.call).to.have.been.calledWith(copyProtractorConfig);
            expect(di.call).to.have.been.calledWith(initialisePlugins);
        })
        .finally(() => {
            tractorLogger.info.restore();
        });
    });

    it('should tell the user what it is doing', () => {
        let di = ineeda({
            call: () => Promise.resolve()
        });

        sinon.stub(tractorLogger, 'info');

        return init(di)
        .then(() => {
            expect(tractorLogger.info).to.have.been.calledWith('Setting up tractor...');
            expect(tractorLogger.info).to.have.been.calledWith('Set up complete!');
        })
        .finally(() => {
            tractorLogger.info.restore();
        });
    });

    it('should tell the user if there is an error', () => {
        let di = ineeda({
            call: () => Promise.reject(new Error('error'))
        });

        sinon.stub(tractorLogger, 'error');
        sinon.stub(tractorLogger, 'info');

        return init(di)
        .catch(NOOP)
        .then(() => {
            expect(tractorLogger.error).to.have.been.calledWith('Something broke, sorry 😕');
            expect(tractorLogger.error).to.have.been.calledWith('error');
        })
        .finally(() => {
            tractorLogger.error.restore();
            tractorLogger.info.restore();
        });
    });
});
