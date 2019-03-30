// Errors:
import { TractorError } from '@tractor/error-handler';

// Constants:
export const INJECTION = '@Inject';

// Types:
// HACK:
// Using strings for DI (😞) means they're definitely untyped...
// So, here's to a lot of `any`:
// tslint:disable:no-any
export type AnyFunction = (this: null, ...args: Array<any>) => any;
export type AnyClass = new (...args: Array<any>) => any;
export type Injectable = { [INJECTION]?: Array<string> };
export type TractorDIClass<T> = T extends AnyClass ? T & Injectable : never;
export type TractorDIFunc<T> = T extends AnyFunction ? T & Injectable : never;
export type TractorDIConstants = Record<string, any>;

// TODO:
// We need to get rid of this ASAP.
export class Container {
    private readonly _constants: Record<string, any> = {};
    private readonly _factories: Record<string, TractorDIFunc<any> | TractorDIClass<any>> = {};

    public constructor () {
        this._constants = {};
        this._factories = {};
    }

    public call <T extends AnyFunction> (func: TractorDIFunc<T>, ...args: Array<any>): ReturnType<T> {
        const toInject = func[INJECTION] || [];
        const dependencies = this._get(toInject);
        return func.apply(null, dependencies.concat(args) as Parameters<T>) as ReturnType<T>;
    }

    public constant (constants: TractorDIConstants): void {
        Object.keys(constants).forEach(key => {
            if (this._constants[key]) {
                throw new TractorError(`Cannot register "${key}" with DI container, because there is already a constant registered with that name`);
            }

            this._constants[key] = constants[key];
        });
    }

    public factory <T extends AnyFunction | AnyClass> (factory?: T extends AnyFunction ? TractorDIFunc<T> : T extends AnyClass ? TractorDIClass<T> : never): void {
        if (!isFunc<T>(factory)) {
            throw new TractorError('Cannot register factory with DI container, because it is not a function');
        }
        if (!factory.name) {
            throw new TractorError('Cannot register factory with DI container, because it is an anonymous function');
        }
        if (this._factories[factory.name]) {
            throw new TractorError(`Cannot register "${factory.name}" with DI container, because there is already a factory registered with that name`);
        }

        this._factories[factory.name] = factory;
    }

    public instantiate <T, U extends AnyClass> (factory: TractorDIClass<U>, ...args: Array<any>): T {
        const toInject = factory[INJECTION] || [];
        const dependencies = this._get(toInject);
        // HACK:
        // tslint complains about an unsafe `any` here. I assume it's right,
        // but can't figure out how to resolve it...
        // tslint:disable-next-line:no-unsafe-any
        return new ((Function.prototype.bind.apply(factory, [null, ...dependencies.concat(args)])))();
    }

    private _get (dependencies: Array<string>): Array<any> {
        return dependencies.map(dependency => {
            const constant = this._constants[dependency];
            return constant || this.instantiate(this._lookup(dependency));
        });
    }

    private _lookup (dependency: string): TractorDIClass<any> {
        const factory = this._factories[dependency];
        if (!factory) {
            throw new TractorError(`Could not find a factory for "${dependency}"`);
        }
        return factory;
    }
}

function isFunc <T> (arg: any): arg is (() => T) {
    return typeof arg === 'function';
}
