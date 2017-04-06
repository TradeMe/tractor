/* global describe:true, it:true */

// Utilities:
import chai from 'chai';

// Test setup:
const expect = chai.expect;

// Dependencies:
import { TractorError } from 'tractor-error-handler';

// Under test:
import { constant, instantiate, factory } from './index';

describe('tractor-dependency-injection:', () => {
    describe('constant:', () => {
        it('should throw an error if something has already been registered by the given name', () => {
            expect(() => {
                constant({ foo: 'foo' });
                constant({ foo: 'bar' });
            }).to.throw(TractorError, 'Cannot register "foo" with DI container, because there is already a constant registered with that name');
        });
    });

    describe('factory:', () => {
        it('should throw an error if it is given something that is not a function', () => {
            expect(() => {
                factory(null);
            }).to.throw(TractorError, 'Cannot register factory with DI container, because it is not a function');
        });

        it('should throw an error if it is given an anonymous function', () => {
            expect(() => {
                factory(() => {});
            }).to.throw(TractorError, 'Cannot register factory with DI container, because it is an anonymous function');
        });

        it('should throw an error if something has already been registered by the given name', () => {
            expect(() => {
                factory(function foo () {});
                factory(function foo () {});
            }).to.throw(TractorError, 'Cannot register "foo" with DI container, because there is already a factory registered with that name');
        });
    });

    describe('instantiate:', () => {
        it('should instantiate an instance of a function with no dependencies', () => {
            function Car () {}
            factory(Car);

            let car = instantiate(Car);

            expect(car).to.be.an.instanceof(Car);
        });

        it('should instantiate an instance of a function with dependencies', () => {
            let config = {};
            constant({ config });

            function Engine () {}
            factory(Engine);

            function Tractor (config, engine) {
                this.config = config;
                this.engine = engine;
            }
            Tractor['@Inject'] = ['config', 'Engine'];
            factory(Tractor);

            let tractor = instantiate(Tractor);

            expect(tractor).to.be.an.instanceof(Tractor);
            expect(tractor.config).to.equal(config);
            expect(tractor.engine).to.be.an.instanceof(Engine);
        });

        it('should throw an error if a dependency cannot be resolved', () => {
            function Kitchen () {}
            Kitchen['@Inject'] = ['Sink']
            factory(Kitchen);

            expect(() => {
                instantiate(Kitchen);
            }).to.throw(TractorError, 'Could not find a factory for "Sink"');
        });
    });
});
