// Dependencies:
import { Container } from './container';

export function container () {
    return new Container()
}

export const DI = container();
