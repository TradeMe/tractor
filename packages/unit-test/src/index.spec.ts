// Test setup:
import { expect } from 'chai';
import { ineeda } from 'ineeda';
import { spy } from 'sinon';

// Dependencies:
// HACK:
// Need to import chai as a module to spy on global functions.
// tslint:disable-next-line:no-duplicate-imports
import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';

// Must happen before we import './index'
spy(chai, 'use');
spy(ineeda, 'intercept');

// Under test:
import * as unitTest from './index';

describe('@tractor/unit-test:', () => {
    describe('exports:', () => {
        it('should export a `NOOP` utility', () => {
            expect(() => unitTest.NOOP()).to.not.throw();
        });

        it('should export `expect`', () => {
            expect(unitTest.expect).to.not.equal(undefined);
        });

        it('should export `dedent`', () => {
            expect(unitTest.dedent).to.not.equal(undefined);
        });

        it('should export `ineeda`', () => {
            expect(unitTest.dedent).to.not.equal(undefined);
        });

        it('should export `sinon`', () => {
            expect(unitTest.dedent).to.not.equal(undefined);
        });
    });

    describe('setup:', () => {
        it('should setup chai plugins', () => {
            expect(chai.use).to.have.been.calledWith(sinonChai);
        });

        it(`should set up ineeda intercepts so that a mock doesn't look like a sinon stub`, () => {
            const mock: sinon.SinonStub = ineeda<sinon.SinonStub>();

            expect(mock.restore).to.equal(null);
            expect(mock.calledBefore).to.equal(null);
        });

        it(`should set up ineeda intercepts so that a mock doesn't look like a Promise`, () => {
            const mock: Promise<void> = ineeda<Promise<void>>();

            expect(mock.then).to.equal(null);
        });

        it('should set up ineeda intercepts so that any function is automatically stubbed', () => {
            const mock: { myFunc (): void } = ineeda({ myFunc: unitTest.NOOP });

            expect((mock.myFunc as sinon.SinonStub).restore).to.not.equal(undefined);
        });
    });
});
