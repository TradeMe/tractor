/*{"name":"control-panel","elements":[{"name":"environment select"},{"name":"run protractor button"},{"name":"tag select"},{"name":"plugin link"}],"actions":[{"name":"select tag","parameters":[{"name":"tag"}]},{"name":"select environment","parameters":[{"name":"environment"}]},{"name":"run protractor","parameters":[]},{"name":"plugin is loaded","parameters":[]}],"version":"0.5.0"}*/
module.exports = function () {
    var ControlPanel = function ControlPanel(parent) {
        var find = parent ? parent.element : element;
        this.environmentSelect = find(by.css('.control-panel__run-options tractor-select[label="environment"] select'));
        this.runProtractorButton = find(by.css('.control-panel__run-options tractor-submit[action="run protractor"] button'));
        this.tagSelect = find(by.css('.control-panel__run-options tractor-select[label="tag"] select'));
        this.pluginLink = find(by.css('header nav ul li:first-child'));
    };
    ControlPanel.prototype.selectTag = function (tag) {
        var self = this;
        return self.tagSelect.selectOptionText(tag);
    };
    ControlPanel.prototype.selectEnvironment = function (environment) {
        var self = this;
        return self.environmentSelect.selectOptionText(environment);
    };
    ControlPanel.prototype.runProtractor = function () {
        var self = this;
        return self.runProtractorButton.click();
    };
    ControlPanel.prototype.pluginIsLoaded = function () {
        var self = this;
        return self.pluginLink.isDisplayed();
    };
    return ControlPanel;
}();