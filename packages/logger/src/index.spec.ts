// Test setup:
import { expect } from '@tractor/unit-test';

// Dependencies:
import * as npmlog from 'npmlog';

// Under test:
import { error, info, mute, warn } from './index';

describe('@tractor/logger:', () => {
    it('should have the correct heading', () => {
        expect(npmlog.heading).to.equal('🚜  tractor');
    });

    describe('@tractor/logger: mute:', () => {
        it('should set the npmlog level to silent', () => {
            mute();

            expect(npmlog.level).to.equal('silent');
        });
    });

    describe('@tractor/logger: error:', () => {
        it('should pass through to npmlog', () => {
            const log = jest.spyOn(npmlog, 'log');

            error('error');

            expect(log.mock.calls).to.deep.equal([['tractor-error', '', 'error']]);

            log.mockRestore();
        });

        it('should handle multiple messages', () => {
            const log = jest.spyOn(npmlog, 'log');

            error('error', 'details');

            expect(log.mock.calls).to.deep.equal([['tractor-error', '', 'error', 'details']]);

            log.mockRestore();
        });
    });

    describe('@tractor/logger: info:', () => {
        it('should pass through to npmlog', () => {
            const log = jest.spyOn(npmlog, 'log');

            info('info');

            expect(log.mock.calls).to.deep.equal([['tractor-info', '', 'info']]);

            log.mockRestore();
        });
    });

    describe('@tractor/logger: warn:', () => {
        it('should pass through to npmlog', () => {
            const log = jest.spyOn(npmlog, 'log');

            warn('warn');

            expect(log.mock.calls).to.deep.equal([['tractor-warn', '', 'warn']]);

            log.mockRestore();
        });
    });
});
