// Test setup:
import { expect } from '@tractor/unit-test';

// Dependencies:
import { TractorError } from '@tractor/error-handler';

// Under test:
import { Container } from './container';
import { inject } from './index';

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

            const arg = 1;
            container.constant({ arg });

            let result: number | null = null;
            const t = inject((arg: number): void => {
                result = arg;
                return;
            }, 'arg');

            container.call(t);

            expect(result).to.equal(arg);
        });

        it('should work if the function has no dependencies', () => {
            const container = new Container();

            let result: number | null = null;
            const t = inject((): void => {
                result = 3;
                return;
            });

            container.call(t);

            expect(result).to.equal(3);
        });

        it('should append any extra given arguments', () => {
            const container = new Container();

            const arg1 = 3;
            container.constant({ arg1 });
            const arg2 = 4;

            let result1: number | null = null;
            let result2: number | null = null;
            const t = inject((arg1: number, arg2: number): void => {
                result1 = arg1;
                result2 = arg2;
                return void 0;
            }, 'arg1');

            container.call(t, arg2);

            expect(result1).to.equal(3);
            expect(result2).to.equal(4);
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
            const t = inject(Tractor, 'config', 'TractorEngine');
            container.factory(t);

            const tractor: Tractor = container.instantiate(t);

            expect(tractor).to.be.an.instanceof(Tractor);
            expect(tractor.config).to.equal(tractorConfig);
            expect(tractor.engine).to.be.an.instanceof(TractorEngine);
        });

        it('should throw an error if a dependency cannot be resolved', () => {
            const container = new Container();

            // tslint:disable-next-line:max-classes-per-file
            class Kitchen { }
            const k = inject(Kitchen, 'Sink');
            container.factory(k);

            expect(() => {
                container.instantiate(k);
            }).to.throw(TractorError, 'Could not find a factory for "Sink"');
        });
    });
});
