'use strict';

// Config:
var config = require('../../utils/get-config.js');

// Utilities:
var log = require('../../utils/logging');
var Promise = require('bluebird');

// Errors:
var TestDirectoryAlreadyExistsError = require('../../Errors/TestDirectoryAlreadyExistsError');

module.exports = function () {
  	return function () {
	    	var installTractorDependenciesLocally = require('./install-tractor-dependencies-locally');
	    	var createTestDirectoryStructure = require('./create-test-directory-structure');
		    var createBaseTestFiles = require('./create-base-test-files');
		    var setUpSelenium = require('./set-up-selenium')

    		log.important('Setting up tractor...');

		    var testDirectory = config.testDirectory;

  		  createTestDirectoryStructure(testDirectory)
		    .then(function () {
			      return createBaseTestFiles(testDirectory);
    		})
        .catch(TestDirectoryAlreadyExistsError, function (e) {
            log.warn(e.message + ' No need to create folder structure or files...');
        })
        .then(function () {
            return installTractorDependenciesLocally()
        })
        .then(function () {
			      return setUpSelenium();
    		})
		    .then(function () {
			      log.important('Set up complete!');
      			process.exit();
    		})
		    .catch(function (e) {
			      log.error('Something broke, sorry :(');
      			log.error(e);
		    	  process.exit(1);
    		});
  	};
};
