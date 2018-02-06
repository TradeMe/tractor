// Dependencies:
import { server } from '@tractor/server';

export function start (di) {
    return di.call(server);
}
start['@Inject'] = ['di'];
