// Test setup:
import { expect } from '@tractor/unit-test';

// Dependencies:
import { Container } from './container';

// Under test:
import { container, DI, inject } from './index';

describe('@tractor/dependency-injection:', () => {
    describe('container:', () => {
        it('should return a new DI container', () => {
            expect(container()).to.be.an.instanceof(Container);
        });

        it('should register itself as a constant', () => {
            const di = container().call(inject((self: Container) => self, 'di'));

            expect(di).to.be.an.instanceOf(Container);
        });
    });

    describe('DI:', () => {
        it('should have a container already created', () => {
            expect(DI).to.be.an.instanceof(Container);
        });
    });
});
