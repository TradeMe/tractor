/*{"name":"control-panel","elements":[{"name":"environment select"},{"name":"run protractor button"},{"name":"tag input"},{"name":"plugin links","type":true},{"name":"show search button"},{"name":"show terminal button"},{"name":"hide terminal button"},{"name":"terminal"}],"actions":[{"name":"set tag","parameters":[{"name":"tag"}]},{"name":"select environment","parameters":[{"name":"environment"}]},{"name":"run protractor","parameters":[]},{"name":"plugin is loaded","parameters":[{"name":"plugin"}]},{"name":"open plugin","parameters":[{"name":"plugin"}]},{"name":"show search","parameters":[]},{"name":"show terminal","parameters":[]},{"name":"hide terminal","parameters":[]},{"name":"get terminal is displayed","parameters":[]}],"version":"0.5.2"}*/
module.exports = function () {
    var ControlPanel = function ControlPanel(parent) {
        var find = parent ? parent.element.bind(parent) : element;
        var findAll = parent ? parent.all.bind(parent) : element.all.bind(element);
        this.environmentSelect = find(by.css('.control-panel__run-options tractor-select[label="environment"] select'));
        this.runProtractorButton = find(by.css('.control-panel__run-options tractor-submit[action="run protractor"] button'));
        this.tagInput = find(by.css('.control-panel__run-options tractor-text-input[label="tag"] input'));
        this.pluginLinks = function (groupSelector) {
            return findAll(by.css('header nav ul li')).getFromGroup(groupSelector);
        };
        this.showSearchButton = find(by.css('tractor-action[action="show search"] button'));
        this.showTerminalButton = find(by.css('tractor-action[action="show terminal"] button'));
        this.hideTerminalButton = find(by.css('tractor-action[action="hide terminal"] button'));
        this.terminal = find(by.css('#terminal'));
    };
    ControlPanel.prototype.setTag = function (tag) {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.tagInput.sendKeys(tag);
        });
        return result;
    };
    ControlPanel.prototype.selectEnvironment = function (environment) {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.environmentSelect.selectOptionByText(environment);
        });
        return result;
    };
    ControlPanel.prototype.runProtractor = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.runProtractorButton.click();
        });
        return result;
    };
    ControlPanel.prototype.pluginIsLoaded = function (plugin) {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.pluginLinks(plugin).isDisplayed();
        });
        return result;
    };
    ControlPanel.prototype.openPlugin = function (plugin) {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.pluginLinks(plugin).click();
        });
        return result;
    };
    ControlPanel.prototype.showSearch = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.showSearchButton.click();
        });
        return result;
    };
    ControlPanel.prototype.showTerminal = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.showTerminalButton.click();
        });
        return result;
    };
    ControlPanel.prototype.hideTerminal = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.hideTerminalButton.click();
        });
        return result;
    };
    ControlPanel.prototype.getTerminalIsDisplayed = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.terminal.isDisplayed();
        });
        return result;
    };
    return ControlPanel;
}();