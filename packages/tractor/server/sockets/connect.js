'use strict';

var protractorRunner = require('./protractor-runner');

module.exports = connect;

function connect (socket) {
    socket.on('run', function (runOptions) {
        protractorRunner.run(socket, runOptions);
    });
}
