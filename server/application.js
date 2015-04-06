'use strict';

// Config:
var config = require('./utils/get-config')();

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

        application.get('/:type/path', require('./api/get-path'));

        application.get('/get-file-structure', require('./actions/file-structure-actions/get-file-structure'));

        application.post('/add-directory', require('./actions/file-structure-actions/add-directory'));
        application.post('/edit-item-path', require('./actions/file-structure-actions/edit-item-path'));
        application.post('/copy-file', require('./actions/file-structure-actions/copy-file'));
        application.post('/delete-file', require('./actions/file-structure-actions/delete-file'));

        application.post('/save-component-file', require('./actions/component-actions/save-component-file'));
        application.post('/save-mock-data-file', require('./actions/mock-data-actions/save-mock-data-file'));
        application.post('/save-feature-file', require('./actions/feature-actions/save-feature-file'));
        application.post('/save-step-definition-file', require('./actions/step-definition-actions/save-step-definition-file'));

        application.get('/config', require('./api/get-config'));
        application.get('/variable-name-valid', require('./api/get-variable-name-valid'));

        sockets.of('/run-protractor')
        .on('connection', require('./api/run-protractor'));

        return server;
    }

    function start () {
        log.important('Starting tractor... brrrrrrmmmmmmm');

        var tractor = server.listen(config.port, function() {
            log.success('tractor is running at port ' + tractor.address().port);
        });
    }
})();
