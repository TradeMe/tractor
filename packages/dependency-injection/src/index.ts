// Dependencies:
import { Container } from './container';
export { INJECTION, TractorDIClass, TractorDIFunc } from './container';

export function container (): Container {
    const di = new Container();
    di.constant({ di });
    return di;
}

export const DI = container();
