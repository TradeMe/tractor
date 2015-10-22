/*{"name":"Control Panel","elements":[{"name":"Components link"},{"name":"Features link"},{"name":"Step Definitions link"},{"name":"Mock Data link"},{"name":"Run Protractor button"},{"name":"Server Status badge"}],"actions":[{"name":"go to Components","parameters":[]},{"name":"go to Features","parameters":[]},{"name":"go to Step Definitions","parameters":[]},{"name":"go to Mock Data","parameters":[]},{"name":"run Protractor","parameters":[]}]}*/
module.exports = function () {
    var ControlPanel = function ControlPanel() {
        this.componentsLink = element(by.css('[href="/components/"]'));
        this.featuresLink = element(by.css('[href="/features/"]'));
        this.stepDefinitionsLink = element(by.css('[href="/step-definitions/"]'));
        this.mockDataLink = element(by.css('[href="/mock-data/"]'));
        this.runProtractorButton = element(by.css('tractor-action[action="Run protractor"]'));
        this.serverStatusBadge = element(by.css('.control-panel__server-status'));
    };
    ControlPanel.prototype.goToComponents = function () {
        var self = this;
        return self.componentsLink.click();
    };
    ControlPanel.prototype.goToFeatures = function () {
        var self = this;
        return self.featuresLink.click();
    };
    ControlPanel.prototype.goToStepDefinitions = function () {
        var self = this;
        return self.stepDefinitionsLink.click();
    };
    ControlPanel.prototype.goToMockData = function () {
        var self = this;
        return self.mockDataLink.click();
    };
    ControlPanel.prototype.runProtractor = function () {
        var self = this;
        return self.runProtractorButton.click();
    };
    return ControlPanel;
}();