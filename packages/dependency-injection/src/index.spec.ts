// Test setup:
import { expect, sinon } from '@tractor/unit-test';

// Dependencies:
import { Container } from './container';

// Under test:
import { container, DI, INJECTION } from './index';

describe('@tractor/dependency-injection:', () => {
    describe('container:', () => {
        it('should return a new DI container', () => {
            expect(container()).to.be.an.instanceof(Container);
        });

        it('should register itself as a constant', () => {
            sinon.stub(Container.prototype, 'constant');

            const di = container();

            expect(Container.prototype.constant).to.have.been.calledWith({ di });

            (Container.prototype.constant as sinon.SinonStub).restore();
        });
    });

    describe('DI:', () => {
        it('should have a container already created', () => {
            expect(DI).to.be.an.instanceof(Container);
        });
    });

    describe('INJECTION:', () => {
        it('should expose the correct @Inject key', () => {
            expect(INJECTION).to.equal('@Inject');
        });
    });
});
