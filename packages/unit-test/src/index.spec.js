// Test setup:
import { expect } from 'chai';
import { ineeda } from 'ineeda';
import sinon from 'sinon';

// Dependencies:
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import sinonChai from 'sinon-chai';

sinon.spy(chai, 'use');
sinon.spy(ineeda, 'intercept');

// Under test:
const unitTest = require('./index');

describe('@tractor/unit-test:', () => {
    describe('exports:', () => {
        it('should export a `NOOP` utility', () => {
            expect(() => unitTest.NOOP()).to.not.throw();
        });
    
        it('should export `expect`', () => {
            expect(unitTest.expect).to.not.be.undefined();
        });
        
        it('should export `dedent`', () => {
            expect(unitTest.dedent).to.not.be.undefined();
        });
        
        it('should export `ineeda`', () => {
            expect(unitTest.dedent).to.not.be.undefined();
        });
        
        it('should export `sinon`', () => {
            expect(unitTest.dedent).to.not.be.undefined();
        });
    });

    describe('setup:', () => {
        it('should setup chai plugins', () => {
            expect(chai.use).to.have.been.calledWith(dirtyChai);
            expect(chai.use).to.have.been.calledWith(sinonChai);
        });

        it(`should set up ineeda intercepts so that a mock doesn't look like a sinon stub`, () => {
            const mock = ineeda();
            
            expect(mock.restore).to.equal(null);
            expect(mock.calledBefore).to.equal(null);
        });

        it(`should set up ineeda intercepts so that a mock doesn't look like a Promise`, () => {
            const mock = ineeda();

            expect(mock.then).to.equal(null);
        });

        it('should set up ineeda intercepts so that any function is automatically stubbed', () => {
            const mock = ineeda({ myFunc: () => {} });

            expect(mock.myFunc.restore).to.not.be.undefined();
        });
    });
});
