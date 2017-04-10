/* global describe:true, it:true */

// Utilities:
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(dirtyChai);
chai.use(sinonChai);

// Dependencies:
import { Container } from './container';

// Under test:
import { container, DI } from './index';

describe('tractor-dependency-injection:', () => {
    describe('container:', () => {
        it('should return a new DI container', () => {
            expect(container()).to.be.an.instanceof(Container);
        });

        it('should register itself as a constant', () => {
            sinon.stub(Container.prototype, 'constant');

            let di = container();

            expect(Container.prototype.constant).to.have.been.calledWith({ di });

            Container.prototype.constant.restore();
        });
    });

    describe('DI:', () => {
        it('should have a container already created', () => {
            expect(DI).to.be.an.instanceof(Container);
        });
    });
});
