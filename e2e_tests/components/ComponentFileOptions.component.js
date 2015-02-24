module.exports = function () {
    var ComponentFileOptions = function ComponentFileOptions() {
        this.componentName = element(by.binding('componentEditor.component.name'));
        this.componentNameInput = element(by.css('.file-options__name-input input'));
        this.saveComponentFileButton = element(by.css('.file-options__save-file button'));
    };
    ComponentFileOptions.prototype.getComponentName = function () {
        var self = this;
        return self.componentName.getInnerHtml();
    };
    ComponentFileOptions.prototype.setComponentName = function (componentName) {
        var self = this;
        return self.componentNameInput.sendKeys(componentName);
    };
    ComponentFileOptions.prototype.saveComponent = function () {
        var self = this;
        return self.saveComponentFileButton.click();
    };
    return ComponentFileOptions;
}();
