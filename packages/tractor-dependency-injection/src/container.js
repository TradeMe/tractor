// Utilities
import { isFunction } from 'util';

// Errors:
import { TractorError } from '@tractor/error-handler';

export class Container {
    constructor () {
        this._constants = {};
        this._factories = {};
    }

    call (func, args) {
        let toInject = func['@Inject'] || [];
        let dependencies = get.call(this, toInject);
        return func.apply(null, dependencies.concat(args));
    }

    constant (constants) {
        Object.keys(constants).forEach(key => {
            if (this._constants[key]) {
                throw new TractorError(`Cannot register "${key}" with DI container, because there is already a constant registered with that name`);
            }

            this._constants[key] = constants[key];
        });
    }

    factory (factory) {
        if (!isFunction(factory)) {
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

    instantiate (factory) {
        let toInject = factory['@Inject'] || [];
        let dependencies = get.call(this, toInject);
        return new (Function.prototype.bind.apply(factory, [null].concat(dependencies)));
    }
}

function get (dependencies) {
    return dependencies.map(dependency => {
        let constant = this._constants[dependency];
        return constant || this.instantiate(lookup.call(this, dependency));
    });
}

function lookup (dependency) {
    let factory = this._factories[dependency];
    if (!factory) {
        throw new TractorError(`Could not find a factory for "${dependency}"`);
    }
    return factory;
}
