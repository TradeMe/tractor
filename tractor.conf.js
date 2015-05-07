'use strict';

// Utilities:
var Promise = require('bluebird');

// Dependencies:
var createTestDirectoryStructure = require('./server/cli/init/create-test-directory-structure');
var del = Promise.promisify(require('del'));

// Constants:
var TRACTOR_E2E_TESTS_RUNNING = './tractor_e2e_tests_running';

module.exports = {
    appRootUrl: 'http://localhost:3000',
	beforeProtractor: function () {
		this._testDirectory = this.testDirectory;
		this.testDirectory = TRACTOR_E2E_TESTS_RUNNING;
		return createTestDirectoryStructure.run(this.testDirectory);
	},
	afterProtractor: function () {
		this.testDirectory = this._testDirectory;
		delete this._testDirectory;
        return del(TRACTOR_E2E_TESTS_RUNNING, {
            force: true
        });
	}
};
