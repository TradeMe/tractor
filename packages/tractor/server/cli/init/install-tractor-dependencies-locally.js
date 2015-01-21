'use strict';

// Utilities:
var _ = require('lodash');
var log = require('../../utils/logging');
var Promise = require('bluebird');

// Dependencies:
var exec = Promise.promisify(require('child_process').exec);

module.exports = (function () {
    var dependencies = [
        'bluebird@2.3.11',
        'chai@1.10.0',
        'chai-as-promised@4.1.1',
        'cucumber@0.4.4',
        'protractor@1.4.0'
    ];

    return function () {
        return getInstalled()
        .then(function (installed) {
            dependencies = filterModules(installed, dependencies);
            return installDependencies(dependencies);
        });
    }

    function getInstalled () {
        log.info('Checking installed npm dependencies...');

        return exec('npm ls --depth 0');
    }

    function filterModules (installed, dependencies) {
        return _.filter(dependencies, function (dependency) {
            return !(new RegExp(dependency, 'gm').test(installed));
        });
    }

    function installDependencies (modules) {
        if (modules.length) {
            log.info('Installing npm dependencies for tractor...');
        } else {
            log.info('All npm dependencies for tractor already installed.');
        }

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
    }
})();
