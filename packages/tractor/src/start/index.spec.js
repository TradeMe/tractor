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
import { container } from 'tractor-dependency-injection';
import { server } from 'tractor-server';

// Under test:
import { start } from './index';

describe('tractor - start/index:', () => {
    it('should start the application', () => {
        let di = container();

        let diCall = sinon.stub(di, 'call');
        diCall.withArgs(server).returns(Promise.resolve());

        return start(di)
        .then(() => {
            expect(di.call).to.have.been.calledWith(server);
        });
    });
});
