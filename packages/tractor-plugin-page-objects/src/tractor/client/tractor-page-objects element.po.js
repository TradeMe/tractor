/*{"name":"tractor-page-objects element","elements":[{"name":"name input"},{"name":"selector input"},{"name":"is multiple checkbox"},{"name":"remove element button"},{"name":"add type button"},{"name":"type select"}],"actions":[{"name":"create element","parameters":[{"name":"name"},{"name":"selector"}]},{"name":"create element group","parameters":[{"name":"name"},{"name":"selector"}]},{"name":"get name","parameters":[]},{"name":"get selector","parameters":[]},{"name":"get is multiple","parameters":[]},{"name":"create typed element","parameters":[{"name":"name"},{"name":"selector"},{"name":"type"}]},{"name":"get type","parameters":[]},{"name":"create typed element group","parameters":[{"name":"name"},{"name":"selector"},{"name":"type"}]}],"version":"0.5.0"}*/
module.exports = function () {
    var TractorPageObjectsElement = function TractorPageObjectsElement(parent) {
        var find = parent ? parent.element.bind(parent) : element;
        this.nameInput = find(by.css('tractor-variable-input[label="Name"] input'));
        this.selectorInput = find(by.css('tractor-text-input[label="selector"] input'));
        this.isMultipleCheckbox = find(by.css('tractor-checkbox[label="Is Multiple"] input'));
        this.removeElementButton = find(by.css('tractor-action[action="Remove element"] button'));
        this.addTypeButton = find(by.css('tractor-action[action="Add type"] button'));
        this.typeSelect = find(by.css('tractor-select[label="Type"] select'));
    };
    TractorPageObjectsElement.prototype.createElement = function (name, selector) {
        var self = this;
        var result;
        result = self.nameInput.sendKeys(name);
        result = result.then(function () {
            return self.selectorInput.sendKeys(selector);
        });
        return result;
    };
    TractorPageObjectsElement.prototype.createElementGroup = function (name, selector) {
        var self = this;
        var result;
        result = self.nameInput.sendKeys(name);
        result = result.then(function () {
            return self.selectorInput.sendKeys(selector);
        });
        result = result.then(function () {
            return self.isMultipleCheckbox.click();
        });
        return result;
    };
    TractorPageObjectsElement.prototype.getName = function () {
        var self = this;
        var result;
        result = self.nameInput.getInputValue();
        return result;
    };
    TractorPageObjectsElement.prototype.getSelector = function () {
        var self = this;
        var result;
        result = self.selectorInput.getInputValue();
        return result;
    };
    TractorPageObjectsElement.prototype.getIsMultiple = function () {
        var self = this;
        var result;
        result = self.isMultipleCheckbox.isSelected();
        return result;
    };
    TractorPageObjectsElement.prototype.createTypedElement = function (name, selector, type) {
        var self = this;
        var result;
        result = self.nameInput.sendKeys(name);
        result = result.then(function () {
            return self.selectorInput.sendKeys(selector);
        });
        result = result.then(function () {
            return self.addTypeButton.click();
        });
        result = result.then(function () {
            return self.typeSelect.selectOptionByText(type);
        });
        return result;
    };
    TractorPageObjectsElement.prototype.getType = function () {
        var self = this;
        var result;
        result = self.typeSelect.getSelectedOptionText();
        return result;
    };
    TractorPageObjectsElement.prototype.createTypedElementGroup = function (name, selector, type) {
        var self = this;
        var result;
        result = self.nameInput.sendKeys(name);
        result = result.then(function () {
            return self.selectorInput.sendKeys(selector);
        });
        result = result.then(function () {
            return self.isMultipleCheckbox.click();
        });
        result = result.then(function () {
            return self.addTypeButton.click();
        });
        result = result.then(function () {
            return self.typeSelect.selectOptionByText(type);
        });
        return result;
    };
    return TractorPageObjectsElement;
}();
