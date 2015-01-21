'use strict';

// Utilities:
var log = require('../../utils/logging');
var Promise = require('bluebird');

// Dependencies:
var exec = Promise.promisify(require('child_process').exec);

module.exports = (function () {
    var modules = [
        'bluebird@2.3.11',
        'chai@1.10.0',
        'chai-as-promised@4.1.1',
        'cucumber@0.4.4',
        'protractor@1.4.0'
    ];

    return function () {
      	log.info('Installing npm modules for tractor...');
        return Promise.all(modules.map(function (module) {
      		  log.info('Installing ' + module + '...');
      	    return exec('npm install ' + module)
        		.then(function () {
          			log.success('Installed ' + module + '.');
        		})
            .catch(function () {
                log.error('Couldn\'t install ' + module + '. Either run again, or install it manually with "npm install ' + module + '"');
            });
      	}));
    };
})();
