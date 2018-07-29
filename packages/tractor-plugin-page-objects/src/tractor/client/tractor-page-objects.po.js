/*{"name":"tractor-page-objects","elements":[{"name":"name"},{"name":"name input"},{"name":"name validation"},{"name":"save button"},{"name":"confirm save dialog"},{"name":"new file button"},{"name":"add element button"},{"name":"elements","type":"tractor-page-objects element"},{"name":"add action button"},{"name":"actions","type":"tractor-page-objects action"}],"actions":[{"name":"create and save page object","parameters":[{"name":"name"}]},{"name":"save page object file","parameters":[]},{"name":"add element","parameters":[{"name":"name"},{"name":"selector"}]},{"name":"add action","parameters":[{"name":"name"}]},{"name":"get name","parameters":[]},{"name":"get name validation","parameters":[]}],"version":"0.5.2"}*/
module.exports = function () {
    var TractorConfirmDialog = require('../../../node_modules/@tractor/ui/dist/page-objects/Core/Components/ConfirmDialog/tractor-confirm-dialog.po.js');
    var TractorPageObjectsElement = require('./tractor-page-objects element.po.js');
    var TractorPageObjectsAction = require('./tractor-page-objects action.po.js');
    var TractorPageObjects = function TractorPageObjects(parent) {
        var find = parent ? parent.element.bind(parent) : element;
        var findAll = parent ? parent.all.bind(parent) : element.all.bind(element);
        this.name = find(by.css('tractor-page-objects .file-options__name'));
        this.nameInput = find(by.css('tractor-page-objects form tractor-variable-input[label="Name"] input'));
        this.nameValidation = find(by.css('tractor-page-objects tractor-variable-input[label="Name"] ng-message'));
        this.saveButton = find(by.css('tractor-submit[action="Save page object file"] button'));
        this.confirmSaveDialog = new TractorConfirmDialog(find(by.css('tractor-confirm-dialog')));
        this.newFileButton = find(by.css('tractor-action[action="New file"] button'));
        this.addElementButton = find(by.css('tractor-action[action="Add element"] button'));
        this.elements = function (groupSelector) {
            return new TractorPageObjectsElement(findAll(by.css('.file-editor__container:nth-child(1) li')).getFromGroup(groupSelector));
        };
        this.addActionButton = find(by.css('tractor-action[action="Add action"] button'));
        this.actions = function (groupSelector) {
            return new TractorPageObjectsAction(findAll(by.css('.file-editor__container:nth-child(2) > section > ul > li')).getFromGroup(groupSelector));
        };
    };
    TractorPageObjects.prototype.createAndSavePageObject = function (name) {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.newFileButton.click();
        });
        result = result.then(function () {
            return self.nameInput.sendKeys(name);
        });
        result = result.then(function () {
            return self.saveButton.click();
        });
        return result;
    };
    TractorPageObjects.prototype.savePageObjectFile = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.saveButton.click();
        });
        result = result.then(function () {
            return self.confirmSaveDialog.ok().catch(function () {
            });
        });
        return result;
    };
    TractorPageObjects.prototype.addElement = function (name, selector) {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.addElementButton.click();
        });
        result = result.then(function () {
            return self.elements('last').addElement(name, selector);
        });
        return result;
    };
    TractorPageObjects.prototype.addAction = function (name) {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.addActionButton.click();
        });
        result = result.then(function () {
            return self.actions('last').addAction(name);
        });
        return result;
    };
    TractorPageObjects.prototype.getName = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.name.getText();
        });
        return result;
    };
    TractorPageObjects.prototype.getNameValidation = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.nameValidation.getText();
        });
        return result;
    };
    return TractorPageObjects;
}();