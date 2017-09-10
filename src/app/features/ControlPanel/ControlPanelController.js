'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var ControlPanel = require('./ControlPanel');

// Dependencies:
require('./Services/RunnerService');
require('./Services/ServerStatusService');

var ControlPanelController = (function () {
    var ControlPanelController = function ControlPanelController (
        persistentStateService,
        runnerService,
        serverStatusService,
        config,
        plugins
    ) {
        this.persistentStateService = persistentStateService;
        this.runnerService = runnerService;
        this.serverStatusService = serverStatusService;

        this.plugins = plugins.filter(function (plugin) {
            return plugin.hasUI;
        });
        this.environments = config.environments;
        this.tags = getTags(config.tags);

        var environment;
        var tag;

        Object.defineProperties(this, {
            environment: {
                get: function () {
                    return environment;
                },
                set: function (newEnv) {
                    environment = newEnv;
                    runnerService.baseUrl = environment;
                    persistentStateService.set('environment', environment);
                }
            },
            tag: {
                get: function () {
                    return tag;
                },
                set: function (newTag) {
                    tag = newTag;
                    persistentStateService.set('tag', tag.name);
                }
            }
        });

        this.environment = getEnvironment.call(this);
        this.tag = getTag.call(this);
    };

    ControlPanelController.prototype.runProtractor = function () {
        this.runnerService.runProtractor({
            tag: this.tag.value
        });
    };

    ControlPanelController.prototype.isServerRunning = function () {
        return this.serverStatusService.isServerRunning();
    };

    return ControlPanelController;
})();

function getTags (tags) {
    var allTags = [{
        name: 'All tests',
        value: ''
    }];
    tags.forEach(function (tag) {
        allTags.push(createTagOption(tag));
        allTags.push(createTagOption('~' + tag));
    });
    return allTags;
}

function createTagOption (tag) {
    return {
        name: tag,
        value: tag
    };
}

function getEnvironment () {
    var saved = this.persistentStateService.get('environment');
    var environment = this.environments.find(function (environment) {
        return environment === saved;
    });
    return environment || _.first(this.environments);
}

function getTag () {
    var saved = this.persistentStateService.get('tag');
    var tag = this.tags.find(function (tag) {
        return tag.name === saved;
    });
    return tag || _.first(this.tags);
}

ControlPanel.controller('ControlPanelController', ControlPanelController);
