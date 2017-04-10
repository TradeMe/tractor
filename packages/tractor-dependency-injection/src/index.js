// Dependencies:
import { Container } from './container';

export function container () {
    let di = new Container()
    di.constant({ di });
    return di;
}

export const DI = container();
