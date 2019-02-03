// Test setup:
import { expect, sinon } from '@tractor/unit-test';

// Dependencies:
import { TractorError } from '@tractor/error-handler';

// Under test:
import { Container, INJECTION, TractorDIClass, TractorDIFunc } from './container';

describe('@tractor/dependency-injection - Container:', () => {
    describe('constant:', () => {
        it('should throw an error if something has already been registered by the given name', () => {
            const container = new Container();

            expect(() => {
                container.constant({ foo: 'foo' });
                container.constant({ foo: 'bar' });
            }).to.throw(TractorError, 'Cannot register "foo" with DI container, because there is already a constant registered with that name');
        });
    });

    describe('factory:', () => {
        it('should throw an error if it is given something that is not a function', () => {
            expect(() => {
                const container = new Container();

                container.factory();
            }).to.throw(TractorError, 'Cannot register factory with DI container, because it is not a function');
        });

        it('should throw an error if it is given an anonymous function', () => {
            const container = new Container();

            expect(() => {
                container.factory(() => void 0);
            }).to.throw(TractorError, 'Cannot register factory with DI container, because it is an anonymous function');
        });

        it('should throw an error if something has already been registered by the given name', () => {
            const container = new Container();

            expect(() => {
                container.factory(function foo (): number { return 0; });
                container.factory(function foo (): number { return 0; });
            }).to.throw(TractorError, 'Cannot register "foo" with DI container, because there is already a factory registered with that name');
        });
    });

    describe('call:', () => {
        it('should inject dependencies into an unregistered function', () => {
            const container = new Container();

            const arg = {};
            container.constant({ arg });

            function test (): void {
                return void 0;
            }
            const t = test as TractorDIFunc<void>;
            t[INJECTION] = ['arg'];
            const wrap = { test: t };

            sinon.stub(wrap, 'test');

            container.call(wrap.test);

            expect(wrap.test).to.have.been.calledWith(arg);
        });

        it('should work if the function has no dependencies', () => {
            const container = new Container();

            function test (): void {
                return void 0;
            }
            const t = test as TractorDIFunc<void>;
            const wrap = { test: t };

            sinon.stub(wrap, 'test');

            container.call(wrap.test);

            expect((wrap.test as sinon.SinonStub).callCount > 0).to.equal(true);
        });

        it('should append any extra given arguments', () => {
            const container = new Container();

            const arg1 = {};
            container.constant({ arg1 });
            const arg2 = {};

            function test (): void {
                return void 0;
            }
            const t = test as TractorDIFunc<void>;
            t[INJECTION] = ['arg1'];
            const wrap = { test: t };

            sinon.stub(wrap, 'test');

            container.call(wrap.test, [arg2]);

            expect(wrap.test).to.have.been.calledWith(arg1, arg2);
        });
    });

    describe('instantiate:', () => {
        it('should instantiate an instance of a function with no dependencies', () => {
            const container = new Container();

            // tslint:disable-next-line:max-classes-per-file
            class Car { }
            container.factory(Car);

            const car = container.instantiate(Car);

            expect(car).to.be.an.instanceof(Car);
        });

        it('should instantiate an instance of a function with dependencies', () => {
            const container = new Container();

            // tslint:disable-next-line:max-classes-per-file
            class TractorConfig { }
            const tractorConfig = {} as TractorConfig ;
            container.constant({ config: tractorConfig });

            // tslint:disable-next-line:max-classes-per-file
            class TractorEngine { }
            container.factory(TractorEngine);

            // tslint:disable-next-line:max-classes-per-file
            class Tractor {
                public constructor (
                    public config: TractorConfig,
                    public engine: TractorEngine
                ) { }
            }
            const t = Tractor as TractorDIClass<Tractor>;
            t[INJECTION] = ['config', 'TractorEngine'];
            container.factory(t);

            const tractor = container.instantiate(t);

            expect(tractor).to.be.an.instanceof(Tractor);
            expect(tractor.config).to.equal(tractorConfig);
            expect(tractor.engine).to.be.an.instanceof(TractorEngine);
        });

        it('should throw an error if a dependency cannot be resolved', () => {
            const container = new Container();

            // tslint:disable-next-line:max-classes-per-file
            class Kitchen { }
            const k = Kitchen as TractorDIClass<Kitchen>;
            k[INJECTION] = ['Sink'];
            container.factory(k);

            expect(() => {
                container.instantiate(k);
            }).to.throw(TractorError, 'Could not find a factory for "Sink"');
        });
    });
});
