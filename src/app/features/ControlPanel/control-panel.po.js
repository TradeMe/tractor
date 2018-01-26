/*{"name":"control-panel","elements":[{"name":"environment select"},{"name":"run protractor button"},{"name":"tag select"},{"name":"plugin links"}],"actions":[{"name":"select tag","parameters":[{"name":"tag"}]},{"name":"select environment","parameters":[{"name":"environment"}]},{"name":"run protractor","parameters":[]},{"name":"plugin is loaded","parameters":[{"name":"plugin"}]},{"name":"open plugin","parameters":[{"name":"plugin"}]}],"version":"0.5.0"}*/
module.exports = function () {
    var ControlPanel = function ControlPanel(parent) {
        var find = parent ? parent.element.bind(parent) : element;
        var findAll = parent ? parent.all.bind(parent) : element.all;
        this.environmentSelect = find(by.css('.control-panel__run-options tractor-select[label="environment"] select'));
        this.runProtractorButton = find(by.css('.control-panel__run-options tractor-submit[action="run protractor"] button'));
        this.tagSelect = find(by.css('.control-panel__run-options tractor-select[label="tag"] select'));
        this.pluginLinks = function (groupSelector) {
            return findAll(by.css('header nav ul li')).getFromGroup(groupSelector);
        };
    };
    ControlPanel.prototype.selectTag = function (tag) {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.tagSelect.selectOptionByText(tag);
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
    return ControlPanel;
}();