// Test setup:
import { expect, sinon } from '@tractor/unit-test';

// Dependencies:
import * as npmlog from 'npmlog';

// Under test:
import { error, info, warn } from './index';

describe('@tractor/logger:', () => {
    it('should have the correct heading', () => {
        expect(npmlog.heading).to.equal('🚜  tractor');
    });

    describe('@tractor/logger: error:', () => {
        it('should pass through to npmlog', () => {
            sinon.stub(npmlog, 'log');

            error('error');

            expect(npmlog.log).to.have.been.calledWith('tractor-error', '', 'error');

            (npmlog.log as sinon.SinonStub).restore();
        });
    });

    describe('@tractor/logger: info:', () => {
        it('should pass through to npmlog', () => {
            sinon.stub(npmlog, 'log');

            info('info');

            expect(npmlog.log).to.have.been.calledWith('tractor-info', '', 'info');

            (npmlog.log as sinon.SinonStub).restore();
        });
    });

    describe('@tractor/logger: warn:', () => {
        it('should pass through to npmlog', () => {
            sinon.stub(npmlog, 'log');

            warn('warn');

            expect(npmlog.log).to.have.been.calledWith('tractor-warn', '', 'warn');

            (npmlog.log as sinon.SinonStub).restore();
        });
    });
});
