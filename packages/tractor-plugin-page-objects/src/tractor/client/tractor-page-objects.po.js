/*{"name":"tractor-page-objects","elements":[{"name":"name input"},{"name":"save button"},{"name":"name"},{"name":"add element button"},{"name":"elements","type":"tractor-page-objects element"},{"name":"confirm save dialog","type":"tractor-confirm-dialog"},{"name":"new file button"}],"actions":[{"name":"create page object","parameters":[{"name":"name"}]},{"name":"get name","parameters":[]},{"name":"create element","parameters":[{"name":"name"},{"name":"selector"}]},{"name":"create element group","parameters":[{"name":"name"},{"name":"selector"}]},{"name":"get element name","parameters":[]},{"name":"get element selector","parameters":[]},{"name":"get element is multiple","parameters":[]},{"name":"create typed element","parameters":[{"name":"name"},{"name":"selector"},{"name":"type"}]},{"name":"get element type","parameters":[]},{"name":"create typed element group","parameters":[{"name":"name"},{"name":"selector"},{"name":"type"}]}],"version":"0.5.0"}*/
module.exports = function () {
    var TractorPageObjectsElement = require('./tractor-page-objects element.po.js');
    var TractorConfirmDialog = require('./tractor-confirm-dialog.po.js');
    var TractorPageObjects = function TractorPageObjects(parent) {
        var find = parent ? parent.element.bind(parent) : element;
        this.nameInput = find(by.css('tractor-page-objects form tractor-variable-input[label="Name"] input'));
        this.saveButton = find(by.css('tractor-submit[action="Save page object file"] button'));
        this.name = find(by.css('tractor-page-objects .file-options__name'));
        this.addElementButton = find(by.css('tractor-action[action="Add element"] button'));
        this.elements = function (groupSelector) {
            return new TractorPageObjectsElement(find.all(by.css('.file-editor__container:first-child li')).getFromGroup(groupSelector));
        };
        this.confirmSaveDialog = new TractorConfirmDialog(find(by.css('tractor-confirm-dialog')));
        this.newFileButton = find(by.css('tractor-action[action="New file"] button'));
    };
    TractorPageObjects.prototype.createPageObject = function (name) {
        var self = this;
        var result;
        result = self.newFileButton.click();
        result = result.then(function () {
            return self.nameInput.sendKeys(name);
        });
        result = result.then(function () {
            return self.saveButton.click();
        });
        return result;
    };
    TractorPageObjects.prototype.getName = function () {
        var self = this;
        var result;
        result = self.name.getText();
        return result;
    };
    TractorPageObjects.prototype.createElement = function (name, selector) {
        var self = this;
        var result;
        result = self.addElementButton.click();
        result = result.then(function () {
            return self.elements('last').createElement(name, selector);
        });
        result = result.then(function () {
            return self.saveButton.click();
        });
        result = result.then(function () {
            return self.confirmSaveDialog.ok();
        });
        return result;
    };
    TractorPageObjects.prototype.createElementGroup = function (name, selector) {
        var self = this;
        var result;
        result = self.addElementButton.click();
        result = result.then(function () {
            return self.elements('last').createElementGroup(name, selector);
        });
        result = result.then(function () {
            return self.saveButton.click();
        });
        result = result.then(function () {
            return self.confirmSaveDialog.ok();
        });
        return result;
    };
    TractorPageObjects.prototype.getElementName = function () {
        var self = this;
        var result;
        result = self.elements('last').getName();
        return result;
    };
    TractorPageObjects.prototype.getElementSelector = function () {
        var self = this;
        var result;
        result = self.elements('last').getSelector();
        return result;
    };
    TractorPageObjects.prototype.getElementIsMultiple = function () {
        var self = this;
        var result;
        result = self.elements('last').getIsMultiple();
        return result;
    };
    TractorPageObjects.prototype.createTypedElement = function (name, selector, type) {
        var self = this;
        var result;
        result = self.addElementButton.click();
        result = result.then(function () {
            return self.elements('last').createTypedElement(name, selector, type);
        });
        result = result.then(function () {
            return self.saveButton.click();
        });
        result = result.then(function () {
            return self.confirmSaveDialog.ok();
        });
        return result;
    };
    TractorPageObjects.prototype.getElementType = function () {
        var self = this;
        var result;
        result = self.elements('last').getType();
        return result;
    };
    TractorPageObjects.prototype.createTypedElementGroup = function (name, selector, type) {
        var self = this;
        var result;
        result = self.addElementButton.click();
        result = result.then(function () {
            return self.elements('last').createTypedElementGroup(name, selector, type);
        });
        result = result.then(function () {
            return self.saveButton.click();
        });
        result = result.then(function () {
            return self.confirmSaveDialog.ok();
        });
        return result;
    };
    return TractorPageObjects;
}();
