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
import { TractorError } from 'tractor-error-handler';

// Under test:
import { Container } from './container';

describe('tractor-dependency-injection - Container:', () => {
    describe('constant:', () => {
        it('should throw an error if something has already been registered by the given name', () => {
            let container = new Container();

            expect(() => {
                container.constant({ foo: 'foo' });
                container.constant({ foo: 'bar' });
            }).to.throw(TractorError, 'Cannot register "foo" with DI container, because there is already a constant registered with that name');
        });
    });

    describe('factory:', () => {
        it('should throw an error if it is given something that is not a function', () => {
            expect(() => {
                let container = new Container();

                container.factory(null);
            }).to.throw(TractorError, 'Cannot register factory with DI container, because it is not a function');
        });

        it('should throw an error if it is given an anonymous function', () => {
            let container = new Container();

            expect(() => {
                container.factory(() => {});
            }).to.throw(TractorError, 'Cannot register factory with DI container, because it is an anonymous function');
        });

        it('should throw an error if something has already been registered by the given name', () => {
            let container = new Container();

            expect(() => {
                container.factory(function foo () {});
                container.factory(function foo () {});
            }).to.throw(TractorError, 'Cannot register "foo" with DI container, because there is already a factory registered with that name');
        });
    });

    describe('call:', () => {
        it('should inject dependencies into an unregistered function', () => {
            let container = new Container();

            let arg = {};
            container.constant({ arg });

            function test () {}
            test['@Inject'] = ['arg'];
            let wrap = { test };

            sinon.stub(wrap, 'test');

            container.call(wrap.test);

            expect(wrap.test).to.have.been.calledWith(arg);
        });

        it('should work if the function has no dependencies', () => {
            let container = new Container();

            function test () {}
            let wrap = { test };

            sinon.stub(wrap, 'test');

            container.call(wrap.test);

            expect(wrap.test).to.have.been.called();
        });

        it('should append any extra given arguments', () => {
            let container = new Container();

            let arg1 = {};
            container.constant({ arg1 });
            let arg2 = {};

            function test () {}
            test['@Inject'] = ['arg1'];
            let wrap = { test };

            sinon.stub(wrap, 'test');

            container.call(wrap.test, [arg2]);

            expect(wrap.test).to.have.been.calledWith(arg1, arg2);
        });
    });

    describe('instantiate:', () => {
        it('should instantiate an instance of a function with no dependencies', () => {
            let container = new Container();

            function Car () {}
            container.factory(Car);

            let car = container.instantiate(Car);

            expect(car).to.be.an.instanceof(Car);
        });

        it('should instantiate an instance of a function with dependencies', () => {
            let container = new Container();

            let config = {};
            container.constant({ config });

            function Engine () {}
            container.factory(Engine);

            function Tractor (config, engine) {
                this.config = config;
                this.engine = engine;
            }
            Tractor['@Inject'] = ['config', 'Engine'];
            container.factory(Tractor);

            let tractor = container.instantiate(Tractor);

            expect(tractor).to.be.an.instanceof(Tractor);
            expect(tractor.config).to.equal(config);
            expect(tractor.engine).to.be.an.instanceof(Engine);
        });

        it('should throw an error if a dependency cannot be resolved', () => {
            let container = new Container();

            function Kitchen () {}
            Kitchen['@Inject'] = ['Sink']
            container.factory(Kitchen);

            expect(() => {
                container.instantiate(Kitchen);
            }).to.throw(TractorError, 'Could not find a factory for "Sink"');
        });
    });
});
