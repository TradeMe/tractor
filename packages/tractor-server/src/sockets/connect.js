// Dependencies:
import { run } from './protractor-runner';

export function socketHandler (config) {
    return function (socket) {
        socket.on('run', runOptions => run(config, socket, runOptions));
    };
}
socketHandler['@Inject'] = ['config'];
