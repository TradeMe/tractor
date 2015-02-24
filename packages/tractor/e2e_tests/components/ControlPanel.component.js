module.exports = function () {
    var ControlPanel = function ControlPanel() {
        this.runProtractorButton = element(by.css('[action="Run protractor"]'));
        this.componentEditorLink = element(by.css('[href="#/component-editor"]'));
        this.gherkinEditorLink = element(by.css('[href="#/gherkin-editor"]'));
        this.stepDefinitionEditorLink = element(by.css('[href="#/step-definition-editor"]'));
    };
    ControlPanel.prototype.runProtractor = function () {
        var self = this;
        return self.runProtractorButton.click();
    };
    ControlPanel.prototype.goToComponentEditor = function () {
        var self = this;
        return self.componentEditorLink.click();
    };
    ControlPanel.prototype.goToGherkinEditor = function () {
        var self = this;
        return self.gherkinEditorLink.click();
    };
    ControlPanel.prototype.goToStepDefinitionEditor = function () {
        var self = this;
        return self.stepDefinitionEditorLink.click();
    };
    return ControlPanel;
}();
