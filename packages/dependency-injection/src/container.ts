// Errors:
import { TractorError } from '@tractor/error-handler';

// Constants:
export const INJECTION = '@Inject';

// Types:
// HACK:
// Using strings for DI (😞) means they're definitely untyped...
// So, here's to a lot of `any`:
// tslint:disable:no-any
type Injectable = { [INJECTION]?: Array<string> };
export type TractorDIClass<T> = Injectable & (new (...args: Array<any>) => T);
export type TractorDIFunc<T> = Injectable & ((...args: Array<any>) => T);

// TODO:
// We need to get rid of this ASAP.
export class Container {
    private readonly _constants: Record<string, any> = {};
    private readonly _factories: Record<string, TractorDIFunc<any> | TractorDIClass<any>> = {};

    public constructor () {
        this._constants = {};
        this._factories = {};
    }

    public call <T> (func: TractorDIFunc<T>, ...args: Array<any>): T {
        const toInject = func[INJECTION] || [];
        const dependencies = this._get(toInject);
        return func.apply(null, dependencies.concat(...args));
    }

    public constant (constants: Record<string, any>): void {
        Object.keys(constants).forEach(key => {
            if (this._constants[key]) {
                throw new TractorError(`Cannot register "${key}" with DI container, because there is already a constant registered with that name`);
            }

            this._constants[key] = constants[key];
        });
    }

    public factory <T> (factory?: TractorDIFunc<T> | TractorDIClass<T>): void {
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

    public instantiate <T> (factory: TractorDIClass<T>): T {
        const toInject = factory[INJECTION] || [];
        const dependencies = this._get(toInject);
        // HACK:
        // tslint complains about an unsafe `any` here. I assume it's right,
        // but can't figure out how to resolve it...
        // tslint:disable-next-line:no-unsafe-any
        return new (Function.prototype.bind.apply(factory, [null, ...dependencies]))();
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
        return factory as TractorDIClass<any>;
    }
}

function isFunc <T> (arg: any): arg is (() => T) {
    return typeof arg === 'function';
}
