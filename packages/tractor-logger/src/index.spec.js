/* global describe:true, it:true */

// Utilities:
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(sinonChai);

// Dependencies:
import npmlog from 'npmlog';

// Under test:
import { error, info, warn } from './index';

describe('tractor-logger:', () => {
    it('should have the correct heading', () => {
        expect(npmlog.heading).to.equal('🚜  tractor');
    });

    describe('tractor-logger: error:', () => {
        it('should pass through to npmlog', () => {
            sinon.stub(npmlog, 'error');

            error('error');

            expect(npmlog.error).to.have.been.calledWith('', 'error');

            npmlog.error.restore();
        });
    });

    describe('tractor-logger: info:', () => {
        it('should pass through to npmlog', () => {
            sinon.stub(npmlog, 'info');

            info('info');

            expect(npmlog.info).to.have.been.calledWith('', 'info');

            npmlog.info.restore();
        });
    });

    describe('tractor-logger: warn:', () => {
        it('should pass through to npmlog', () => {
            sinon.stub(npmlog, 'warn');

            warn('warn');

            expect(npmlog.warn).to.have.been.calledWith('', 'warn');

            npmlog.warn.restore();
        });
    });
});
