'use strict';

// Config:
var config = require('./utils/get-config')();

// Utilities:
var log = require('./utils/logging');
var constants = require('./constants');

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

        var getFolderStructure = require('./actions/get-folder-structure');
        var getListOfFileNames = require('./actions/get-list-of-file-names');
        var openFile = require('./actions/open-file');

        application.get('/get-component-folder-structure', getFolderStructure(constants.COMPONENTS_DIR));
        application.get('/get-feature-file-names', getListOfFileNames(constants.FEATURES_DIR, constants.FEATURES_EXTENSION));
        application.get('/get-step-definition-file-names', getListOfFileNames(constants.STEP_DEFINITIONS_DIR, constants.STEP_DEFINITIONS_EXTENSION));
        application.get('/get-mock-data-file-names', getListOfFileNames(constants.MOCK_DATA_DIR, constants.MOCK_DATA_EXTENSION));

        application.post('/edit-directory', require('./actions/edit-directory'));

        application.get('/open-component-file', openFile(constants.COMPONENTS_DIR, { parseJS: true }));
        application.get('/open-feature-file', openFile(constants.FEATURES_DIR, { lexFeature: true }));
        application.get('/open-step-definition-file', openFile(constants.STEP_DEFINITIONS_DIR, { parseJS: true }));
        application.get('/open-mock-data-file', openFile(constants.MOCK_DATA_DIR));

        application.get('/get-config', require('./actions/get-config'));

        application.post('/save-component-file', require('./actions/save-component-file'));
        application.post('/save-feature-file', require('./actions/save-feature-file'));
        application.post('/save-step-definition-file', require('./actions/save-step-definition-file'));
        application.post('/save-mock-data-file', require('./actions/save-mock-data-file'));

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
