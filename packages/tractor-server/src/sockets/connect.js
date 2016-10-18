// Dependencies:
import protractorRunner from './protractor-runner';

export default function connect (socket) {
    socket.on('run', runOptions => protractorRunner.run(socket, runOptions));
}
