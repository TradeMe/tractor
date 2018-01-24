/*{"name":"tractor-page-objects element","elements":[{"name":"name input"},{"name":"remove element button"},{"name":"selector input"},{"name":"is group checkbox"},{"name":"add type button"},{"name":"type select"}],"actions":[{"name":"add element","parameters":[{"name":"name"},{"name":"selector"}]},{"name":"add type","parameters":[{"name":"type"}]},{"name":"toggle is group","parameters":[]},{"name":"get name","parameters":[]},{"name":"get selector","parameters":[]},{"name":"get is group","parameters":[]},{"name":"get type","parameters":[]}],"version":"0.5.0"}*/
module.exports = function () {
    var TractorPageObjectsElement = function TractorPageObjectsElement(parent) {
        var find = parent ? parent.element.bind(parent) : element;
        this.nameInput = find(by.css('tractor-variable-input[label="Name"] input'));
        this.removeElementButton = find(by.css('tractor-action[action="Remove element"] button'));
        this.selectorInput = find(by.css('tractor-text-input[label="selector"] input'));
        this.isGroupCheckbox = find(by.css('tractor-checkbox[label="Is Group"] input'));
        this.addTypeButton = find(by.css('tractor-action[action="Add type"] button'));
        this.typeSelect = find(by.css('tractor-select[label="Type"] select'));
    };
    TractorPageObjectsElement.prototype.addElement = function (name, selector) {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.nameInput.sendKeys(name);
        });
        result = result.then(function () {
            return self.selectorInput.sendKeys(selector);
        });
        return result;
    };
    TractorPageObjectsElement.prototype.addType = function (type) {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.addTypeButton.click();
        });
        result = result.then(function () {
            return self.typeSelect.selectOptionByText(type);
        });
        return result;
    };
    TractorPageObjectsElement.prototype.toggleIsGroup = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.isGroupCheckbox.click();
        });
        return result;
    };
    TractorPageObjectsElement.prototype.getName = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.nameInput.getInputValue();
        });
        return result;
    };
    TractorPageObjectsElement.prototype.getSelector = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.selectorInput.getInputValue();
        });
        return result;
    };
    TractorPageObjectsElement.prototype.getIsGroup = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.isGroupCheckbox.isSelected();
        });
        return result;
    };
    TractorPageObjectsElement.prototype.getType = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.typeSelect.getSelectedOptionText();
        });
        return result;
    };
    return TractorPageObjectsElement;
}();