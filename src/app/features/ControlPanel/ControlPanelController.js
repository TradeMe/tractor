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
        runnerService,
        serverStatusService,
        config,
        plugins
    ) {
        this.runnerService = runnerService;
        this.serverStatusService = serverStatusService;

        this.environments = config.environments;
        this.plugins = plugins.filter(function (plugin) {
            return plugin.hasUI;
        });
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
                }
            }
        });

        this.environment = _.first(this.environments);
        this.tag = _.first(this.tags);
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

ControlPanel.controller('ControlPanelController', ControlPanelController);
