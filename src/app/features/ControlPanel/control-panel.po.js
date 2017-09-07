/*{"name":"control-panel","elements":[{"name":"environment select"},{"name":"run protractor button"},{"name":"tag select"}],"actions":[{"name":"select tag","parameters":[{"name":"tag"}]},{"name":"select environment","parameters":[{"name":"environment"}]},{"name":"run protractor","parameters":[]}]}*/
module.exports = function () {
    var ControlPanel = function ControlPanel() {
        this.environmentSelect = element(by.css('.control-panel__run-options tractor-select[label="environment"] select'));
        this.runProtractorButton = element(by.css('.control-panel__run-options tractor-submit[action="run protractor"] button'));
        this.tagSelect = element(by.css('.control-panel__run-options tractor-select[label="tag"] select'));
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
    return ControlPanel;
}();
