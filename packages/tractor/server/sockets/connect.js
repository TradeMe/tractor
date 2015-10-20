'use strict';

// Dependencies:
import { run } from './protractor-runner';

export default function connect (socket) {
    socket.on('run', (runOptions) => run(socket, runOptions));
}
