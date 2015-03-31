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

        application.get('/get-file-structure', require('./actions/file-actions/get-file-structure'));

        application.post('/add-directory', require('./actions/file-actions/add-directory'));
        application.post('/edit-item-path', require('./actions/file-actions/edit-item-path'));
        application.post('/delete-file', require('./actions/file-actions/delete-file'));

        application.get('/get-component-path', require('./actions/component-actions/get-component-path'));
        application.post('/save-component-file', require('./actions/component-actions/save-component-file'));

        application.get('/get-mock-data-path', require('./actions/mock-data-actions/get-mock-data-path'));
        application.post('/save-mock-data-file', require('./actions/mock-data-actions/save-mock-data-file'));

        application.get('/get-feature-path', require('./actions/feature-actions/get-feature-path'));
        application.post('/save-feature-file', require('./actions/feature-actions/save-feature-file'));

        application.get('/get-step-definition-path', require('./actions/step-definition-actions/get-step-definition-path'));
        application.post('/save-step-definition-file', require('./actions/step-definition-actions/save-step-definition-file'));

        application.get('/get-config', require('./actions/get-config'));

        application.post('/validate-javascript-variable-name', require('./actions/validate-javascript-variable-name'));

        require('./actions/setup-protractor-listener')(sockets);

        return server;
    }

    function start () {
        log.important('Starting tractor... brrrrrrmmmmmmm');

        var tractor = server.listen(config.port, function() {
            log.success('tractor is running at port ' + tractor.address().port);
        });
    }
})();
