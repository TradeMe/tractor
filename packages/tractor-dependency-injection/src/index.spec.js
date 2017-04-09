/* global describe:true, it:true */

// Utilities:
import chai from 'chai';
import dirtyChai from 'dirty-chai';

// Test setup:
const expect = chai.expect;
chai.use(dirtyChai);

// Dependencies:
import { Container } from './container';

// Under test:
import { container, DI } from './index';

describe('tractor-dependency-injection:', () => {
    describe('container:', () => {
        it('should return a new DI container', () => {
            expect(container()).to.be.an.instanceof(Container);
        });
    });

    describe('DI:', () => {
        it('should have a container already created', () => {
            expect(DI).to.be.an.instanceof(Container);
        });
    });
});
