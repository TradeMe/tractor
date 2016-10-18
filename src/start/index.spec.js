/* global describe:true, it:true */

// Utilities:
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import Promise from 'bluebird';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(dirtyChai);
chai.use(sinonChai);

// Dependencies:
import tractorServer from 'tractor-server';

// Under test:
import cliStart from './index';

describe('tractor - start/index:', () => {
    it('should start the application', () => {
        sinon.stub(tractorServer, 'start').returns(Promise.resolve());

        return cliStart()
        .then(() => {
            expect(tractorServer.start).to.have.been.called();

            tractorServer.start.restore();
        });
    });
});
