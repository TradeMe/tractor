'use strict';

// Utilities:
var constants = require('../../constants');
var log = require('../../utils/logging');
var Promise = require('bluebird');

// Dependencies:
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');

module.exports = (function () {
	  return function (testDirectory) {
				return createRootFolder(testDirectory)
				.then(function () {
						return createSubfolders(testDirectory);
				});
		}

		function createRootFolder (testDirectory) {
				log.info('Creating directory structure...');
				return fs.mkdirAsync(testDirectory)
				.catch(Promise.OperationalError, function (e) {
						if (e && e.cause && e.cause.code === 'EEXIST') {
								log.error('"' + testDirectory + '" directory already exists.');
								process.exit(1);
						}
				});
		}

		function createSubfolders (testDirectory) {
			return Promise.all([
					fs.mkdirAsync(path.join(testDirectory, constants.FEATURES_DIR)),
					fs.mkdirAsync(path.join(testDirectory, constants.STEP_DEFINITIONS_DIR)),
					fs.mkdirAsync(path.join(testDirectory, constants.COMPONENTS_DIR)),
					fs.mkdirAsync(path.join(testDirectory, constants.SUPPORT_DIR))
			])
			.then(function () {
					log.success('Directory structure created.');
			});
		}
})();
