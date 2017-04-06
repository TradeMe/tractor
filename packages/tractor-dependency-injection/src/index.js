// Constants:
const CONSTANTS = {};
const FACTORIES = {};

// Utilities
import { isFunction } from 'util';

// Errors:
import { TractorError } from 'tractor-error-handler';

export function constant (constants) {
    Object.keys(constants).forEach(key => {
        if (CONSTANTS[key]) {
            throw new TractorError(`Cannot register "${key}" with DI container, because there is already a constant registered with that name`);
        }

        CONSTANTS[key] = constants[key];
    })
}

export function factory (factory) {
    if (!isFunction(factory)) {
        throw new TractorError('Cannot register factory with DI container, because it is not a function');
    }
    if (!factory.name) {
        throw new TractorError('Cannot register factory with DI container, because it is an anonymous function');
    }
    if (FACTORIES[factory.name]) {
        throw new TractorError(`Cannot register "${factory.name}" with DI container, because there is already a factory registered with that name`);
    }

    FACTORIES[factory.name] = factory;
}

export function instantiate (factory) {
    let toInject = factory['@Inject'] || [];
    let dependencies = get(toInject);
    return new (Function.prototype.bind.apply(factory, [null].concat(dependencies)));
}

function get (dependencies) {
    return dependencies.map(dependency => {
        let constant = CONSTANTS[dependency];
        return constant || instantiate(lookup(dependency));
    });
}

function lookup (dependency) {
    let factory = FACTORIES[dependency];
    if (!factory) {
        throw new TractorError(`Could not find a factory for "${dependency}"`);
    }
    return factory;
}
