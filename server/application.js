'use strict';

// Config:
var config = require('./utils/get-config');

// Utilities:
var log = require('./utils/logging');

// Dependencies:
var bodyParser = require('body-parser');
var cors       = require('cors');
var express    = require('express');
var http       = require('http');
var io         = require('socket.io');
var path       = require('path');

module.exports = (function () {
      var server = init();

      return {
          start: start
      };

      function init () {
          var application = express();
          var server = http.Server(application);
          var sockets = io(server);

          application.use(express.static(path.resolve(__dirname, '../www')));

          application.use(bodyParser.json());
          application.use(bodyParser.urlencoded({
              extended: false
          }));

          application.use(cors());

          var getListOfFileNames = require('./actions/get-list-of-file-names');
          var openFile = require('./actions/open-file');

          application.get('/get-component-file-names', getListOfFileNames('components', '.component.js'));
          application.get('/get-gherkin-file-names', getListOfFileNames('features', '.feature'));
          application.get('/get-step-definition-file-names', getListOfFileNames('step_definitions', '.step.js'));

          application.get('/open-component-file', openFile('components', true));
          application.get('/open-gherkin-file', openFile('features', false, true));
          application.get('/open-step-definition-file', openFile('step_definitions', true));

          application.get('/get-config', require('./actions/get-config'));

          application.post('/save-component-file', require('./actions/save-component-file'));
          application.post('/save-gherkin-file', require('./actions/save-gherkin-file'));
          application.post('/save-step-definition-file', require('./actions/save-step-definition-file'));

          application.post('/validate-javascript-variable-name', require('./actions/validate-javascript-variable-name'));

          require('./actions/run-protractor')(sockets);

          return server;
      }

      function start () {
          log.important('Starting tractor...');

          var tractor = server.listen(config.port, function() {
              log.success('tractor is running at port ' + tractor.address().port);
          });

          delete module.exports.start;
      }
})();
