'use strict';

// Config:
var config = require('./utils/create-config')();

// Utilities:
var log = require('./utils/logging');

// Dependencies:
var bodyParser = require('body-parser');
var cors = require('cors');
var express = require('express');
var http = require('http');
var io = require('socket.io');
var path = require('path');

module.exports = (function () {
    var server = init();

    return {
        start: start
    };

    function init () {
        var application = express();
        /* eslint-disable new-cap */
        var server = http.Server(application);
        /* eslint-enable new-cap */
        var sockets = io(server);

        application.use(express.static(path.resolve(__dirname, '../www')));

        application.use(bodyParser.json());
        application.use(bodyParser.urlencoded({
            extended: false
        }));

        application.use(cors());

        application.get('/file-structure', require('./api/get-file-structure')());

        application.post('/:type/directory', require('./api/create-directory')());
        application.patch('/:type/directory/path', require('./api/edit-item-path')());
        application.delete('/:type/directory', require('./api/delete-item')());

        application.put('/:type/file', require('./api/save-file')());
        application.get('/:type/file/path', require('./api/get-path'));
        application.patch('/:type/file/path', require('./api/edit-item-path')());
        application.post('/:type/file/copy', require('./api/copy-file')());
        application.delete('/:type/file', require('./api/delete-item')());

        application.get('/config', require('./api/get-config'));
        application.get('/variable-name-valid', require('./api/get-variable-name-valid'));

        sockets.of('/run-protractor')
        .on('connection', require('./api/run-protractor'));

        return server;
    }

    function start () {
        log.important('Starting tractor... brrrrrrmmmmmmm');

        var tractor = server.listen(config.port, function () {
            log.success('tractor is running at port ' + tractor.address().port);
        });
    }
})();
