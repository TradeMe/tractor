'use strict';

// ES2015:
var babel = require('babel/register');

// Utilities:
var Promise = require('bluebird');

// Dependencies:
var createTestDirectoryStructure = require('./server/cli/init/create-test-directory-structure');
var del = Promise.promisify(require('del'));

// Constants:
var TRACTOR_E2E_TESTS_RUNNING = './tractor_e2e_tests_running';

module.exports = {
    environments: [
        'http://localhost:3000',
        'http://localhost:4000'
    ],
	beforeProtractor: function () {
        var fileStructure = require('./server/file-structure');

		this._testDirectory = this.testDirectory;
		this.testDirectory = TRACTOR_E2E_TESTS_RUNNING;
        return createTestDirectoryStructure.run(this.testDirectory)
        .then(function () {
            return fileStructure.refresh();
        }.bind(this));
	},
	afterProtractor: function () {
        var fileStructure = require('./server/file-structure');

		this.testDirectory = this._testDirectory;
		delete this._testDirectory;
        return fileStructure.refresh()
        .then(function () {
            return del(TRACTOR_E2E_TESTS_RUNNING, {
                force: true
            });
        }.bind(this));
	}
};
