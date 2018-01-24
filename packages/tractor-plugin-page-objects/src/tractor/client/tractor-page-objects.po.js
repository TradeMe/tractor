/*{"name":"tractor-page-objects","elements":[{"name":"name"},{"name":"name input"},{"name":"save button"},{"name":"confirm save dialog"},{"name":"new file button"},{"name":"add element button"},{"name":"elements"},{"name":"add action button"},{"name":"actions"}],"actions":[{"name":"create and save page object","parameters":[{"name":"name"}]},{"name":"save page object file","parameters":[]},{"name":"add element","parameters":[{"name":"name"},{"name":"selector"}]},{"name":"add element type","parameters":[{"name":"type"}]},{"name":"toggle element is group","parameters":[]},{"name":"add action","parameters":[{"name":"name"}]},{"name":"add action parameter","parameters":[{"name":"name"}]},{"name":"add action argument","parameters":[{"name":"name"},{"name":"value"}]},{"name":"get name","parameters":[]},{"name":"get element name","parameters":[]},{"name":"get element selector","parameters":[]},{"name":"get element type","parameters":[]},{"name":"get element is group","parameters":[]},{"name":"get action name","parameters":[]},{"name":"get interaction element","parameters":[]},{"name":"get interaction action","parameters":[]},{"name":"get interaction argument name","parameters":[{"name":"name"}]},{"name":"get interaction argument value","parameters":[{"name":"name"}]},{"name":"select interaction element","parameters":[{"name":"element"}]},{"name":"select interaction action","parameters":[{"name":"action"}]}],"version":"0.5.0"}*/
module.exports = function () {
    var TractorConfirmDialog = require('../../../node_modules/tractor-client/dist/page-objects/Core/Components/ConfirmDialog/tractor-confirm-dialog.po.js');
    var TractorPageObjectsElement = require('./tractor-page-objects element.po.js');
    var TractorPageObjectsAction = require('./tractor-page-objects action.po.js');
    var TractorPageObjects = function TractorPageObjects(parent) {
        var find = parent ? parent.element.bind(parent) : element;
        var findAll = parent ? parent.all.bind(parent) : element.all;
        this.name = find(by.css('tractor-page-objects .file-options__name'));
        this.nameInput = find(by.css('tractor-page-objects form tractor-variable-input[label="Name"] input'));
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
            return self.confirmSaveDialog.ok();
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
    TractorPageObjects.prototype.addElementType = function (type) {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.elements('last').addType(type);
        });
        return result;
    };
    TractorPageObjects.prototype.toggleElementIsGroup = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.elements('last').toggleIsGroup();
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
    TractorPageObjects.prototype.addActionParameter = function (name) {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.actions('last').addParameter(name);
        });
        return result;
    };
    TractorPageObjects.prototype.addActionArgument = function (name, value) {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.actions('last').addArgument(name, value);
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
    TractorPageObjects.prototype.getElementName = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.elements('last').getName();
        });
        return result;
    };
    TractorPageObjects.prototype.getElementSelector = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.elements('last').getSelector();
        });
        return result;
    };
    TractorPageObjects.prototype.getElementType = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.elements('last').getType();
        });
        return result;
    };
    TractorPageObjects.prototype.getElementIsGroup = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.elements('last').getIsGroup();
        });
        return result;
    };
    TractorPageObjects.prototype.getActionName = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.actions('last').getName();
        });
        return result;
    };
    TractorPageObjects.prototype.getInteractionElement = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.actions('last').getInteractionElement();
        });
        return result;
    };
    TractorPageObjects.prototype.getInteractionAction = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.actions('last').getInteractionAction();
        });
        return result;
    };
    TractorPageObjects.prototype.getInteractionArgumentName = function (name) {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.actions('last').getInteractionArgumentName(name);
        });
        return result;
    };
    TractorPageObjects.prototype.getInteractionArgumentValue = function (name) {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.actions('last').getInteractionArgumentValue(name);
        });
        return result;
    };
    TractorPageObjects.prototype.selectInteractionElement = function (element) {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.actions('last').selectInteractionElement(element);
        });
        return result;
    };
    TractorPageObjects.prototype.selectInteractionAction = function (action) {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.actions('last').selectInteractionAction(action);
        });
        return result;
    };
    return TractorPageObjects;
}();
