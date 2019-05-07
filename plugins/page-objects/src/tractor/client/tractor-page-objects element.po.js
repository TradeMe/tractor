/*{"name":"tractor-page-objects element","elements":[{"name":"name input"},{"name":"name validation"},{"name":"remove element button"},{"name":"selector input"},{"name":"selector validation"},{"name":"group checkbox"},{"name":"add type button"},{"name":"type autocomplete","type":"tractor-autocomplete"}],"actions":[{"name":"add element","parameters":[{"name":"name"},{"name":"selector"}]},{"name":"add type","parameters":[{"name":"type"}]},{"name":"toggle group","parameters":[]},{"name":"get name","parameters":[]},{"name":"get name validation","parameters":[]},{"name":"get selector","parameters":[]},{"name":"get selector validation","parameters":[]},{"name":"get group","parameters":[]},{"name":"get type","parameters":[]}],"version":"1.4.0"}*/
module.exports = function () {
    var TractorAutocomplete = require('@tractor/ui/dist/page-objects/Core/Components/Autocomplete/tractor-autocomplete.po.js');
    var TractorPageObjectsElement = function TractorPageObjectsElement(host) {
        var find = host ? host.element.bind(host) : element;
        this.nameInput = find(by.css('tractor-variable-input[label="Name"] input'));
        this.nameValidation = find(by.css('tractor-variable-input[label="Name"] ng-message'));
        this.removeElementButton = find(by.css('tractor-action[action="Remove element"] button'));
        this.selectorInput = find(by.css('tractor-text-input[label="selector"] input'));
        this.selectorValidation = find(by.css('tractor-text-input[label="selector"] ng-message'));
        this.groupCheckbox = find(by.css('tractor-checkbox[label="Group"] input'));
        this.addTypeButton = find(by.css('tractor-action[action="Add type"] button'));
        this.typeAutocomplete = new TractorAutocomplete(find(by.css('tractor-autocomplete')));
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
            return self.typeAutocomplete.sendKeys(type);
        });
        return result;
    };
    TractorPageObjectsElement.prototype.toggleGroup = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.groupCheckbox.click();
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
    TractorPageObjectsElement.prototype.getNameValidation = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.nameValidation.getText();
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
    TractorPageObjectsElement.prototype.getSelectorValidation = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.selectorValidation.getText();
        });
        return result;
    };
    TractorPageObjectsElement.prototype.getGroup = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.groupCheckbox.isSelected();
        });
        return result;
    };
    TractorPageObjectsElement.prototype.getType = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.typeAutocomplete.getInputValue();
        });
        return result;
    };
    return TractorPageObjectsElement;
}();