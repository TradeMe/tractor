/*{"name":"tractor-mocha-specs","elements":[{"name":"name"},{"name":"name input"},{"name":"name validation"},{"name":"save button"},{"name":"confirm save dialog","type":"tractor-confirm-dialog"},{"name":"new file button"},{"name":"add test button"},{"name":"tests","type":"tractor-mocha-specs test","group":true}],"actions":[{"name":"create and save mocha spec","parameters":[{"name":"name"}]},{"name":"save mocha spec","parameters":[]},{"name":"get name","parameters":[]},{"name":"get name validation","parameters":[]},{"name":"add test","parameters":[{"name":"name"}]}],"version":"0.7.0"}*/
module.exports = function () {
    var TractorConfirmDialog = require('../../../node_modules/@tractor/ui/dist/page-objects/Core/Components/ConfirmDialog/tractor-confirm-dialog.po.js');
    var TractorMochaSpecsTest = require('./tractor-mocha-specs test.po.js');
    var TractorMochaSpecs = function TractorMochaSpecs(host) {
        var find = host ? host.element.bind(host) : element;
        var findAll = host ? host.all.bind(host) : element.all.bind(element);
        this.name = find(by.css('tractor-mocha-specs .file-options__name'));
        this.nameInput = find(by.css('tractor-mocha-specs form tractor-text-input[label="Name"] input'));
        this.nameValidation = find(by.css('tractor-mocha-specs form tractor-text-input[label="Name"] ng-message'));
        this.saveButton = find(by.css('tractor-submit[action="Save spec file"] button'));
        this.confirmSaveDialog = new TractorConfirmDialog(find(by.css('tractor-confirm-dialog')));
        this.newFileButton = find(by.css('tractor-action[action="New file"] button'));
        this.addTestButton = find(by.css('tractor-action[action="Add test"] button'));
        this.tests = function (groupSelector) {
            return new TractorMochaSpecsTest(findAll(by.css('li[ng-repeat="test in $ctrl.fileModel.tests"]')).getFromGroup(groupSelector));
        };
    };
    TractorMochaSpecs.prototype.createAndSaveMochaSpec = function (name) {
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
        result = result.then(function () {
            return browser.sleep(5000);
        });
        return result;
    };
    TractorMochaSpecs.prototype.saveMochaSpec = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.saveButton.click();
        });
        result = result.then(function () {
            return self.confirmSaveDialog.ok().catch(function () {
            });
        });
        result = result.then(function () {
            return browser.sleep(5000);
        });
        return result;
    };
    TractorMochaSpecs.prototype.getName = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.name.getText();
        });
        return result;
    };
    TractorMochaSpecs.prototype.getNameValidation = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.nameValidation.getText();
        });
        return result;
    };
    TractorMochaSpecs.prototype.addTest = function (name) {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.addTestButton.click();
        });
        result = result.then(function () {
            return self.tests('last').addTest(name);
        });
        return result;
    };
    return TractorMochaSpecs;
}();