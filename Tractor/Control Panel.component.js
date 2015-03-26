/*{
    "name": "Control Panel",
    "elements": [
        {
            "name": "run protractor button"
        },
        {
            "name": "component editor link"
        },
        {
            "name": "feature editor link"
        },
        {
            "name": "step definition editor link"
        },
        {
            "name": "mock data editor link"
        }
    ],
    "actions": [
        {
            "name": "run Protractor"
        },
        {
            "name": "go to component editor"
        },
        {
            "name": "go to feature editor"
        },
        {
            "name": "go to step definition editor"
        },
        {
            "name": "go to mock data editor"
        }
    ]
}*/
module.exports = function () {
    var ControlPanel = function ControlPanel() {
        this.runProtractorButton = element(by.css('[action="Run protractor"]'));
        this.componentEditorLink = element(by.css('[href="#/component-editor"]'));
        this.featureEditorLink = element(by.css('[href="#/feature-editor"]'));
        this.stepDefinitionEditorLink = element(by.css('[href="#/step-definition-editor"]'));
        this.mockDataEditorLink = element(by.css('[href="#/mock-data-editor"]'));
    };
   ControlPanel.prototype.runProtractor = function () {
        var self = this;
        return self.runProtractorButton.click();
    };
   ControlPanel.prototype.goToComponentEditor = function () {
        var self = this;
        return self.componentEditorLink.click();
    };
   ControlPanel.prototype.goToFeatureEditor = function () {
        var self = this;
        return self.featureEditorLink.click();
    };
   ControlPanel.prototype.goToStepDefinitionEditor = function () {
        var self = this;
        return self.stepDefinitionEditorLink.click();
    };
   ControlPanel.prototype.goToMockDataEditor = function () {
        var self = this;
        return self.mockDataEditorLink.click();
    };
    return ControlPanel;
}();
