'use strict';

// Dependencies:
import * as protractorRunner from './protractor-runner';

export default function connect (socket) {
    socket.on('run', (runOptions) => protractorRunner.run(socket, runOptions));
}
