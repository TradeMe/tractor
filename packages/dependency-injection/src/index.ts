// Dependencies:
import { AnyFunction, Container, Injectable, INJECTION, TractorDIClass, TractorDIFunc } from './container';
export { Container, TractorDIClass, TractorDIConstants, TractorDIFunc } from './container';

export function container (): Container {
    const di = new Container();
    di.constant({ di });
    return di;
}

export function inject <T> (target: T, ...dependencies: Array<string>): T extends AnyFunction ? TractorDIFunc<T> : TractorDIClass<T> {
    const injectable = target;
    (injectable as Injectable)[INJECTION] = dependencies;
    return injectable as T extends AnyFunction ? TractorDIFunc<T> : TractorDIClass<T>;
}

export const DI = container();
