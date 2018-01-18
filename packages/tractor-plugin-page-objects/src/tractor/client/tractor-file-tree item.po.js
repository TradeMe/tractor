/*{"name":"tractor-file-tree item","elements":[{"name":"name"},{"name":"options button"},{"name":"edit name button"},{"name":"edit name input"},{"name":"copy item button"},{"name":"delete item button"}],"actions":[{"name":"get name","parameters":[]},{"name":"edit name","parameters":[{"name":"new name"}]},{"name":"open","parameters":[]},{"name":"status text","parameters":[]}],"version":"0.5.0"}*/
module.exports = function () {
    var TractorFileTreeItem = function TractorFileTreeItem(parent) {
        var find = parent ? parent.element.bind(parent) : element;
        this.name = find(by.css('.file-tree__item-name'));
        this.optionsButton = find(by.css('.file-tree__item-options'));
        this.editNameButton = find(by.css('.file-tree__item-options-panel tractor-action[action="Edit name"] button'));
        this.editNameInput = find(by.css('.file-tree__item-rename'));
        this.copyItemButton = find(by.css('.file-tree__item-options-panel tractor-action[action="Copy item"] button'));
        this.deleteItemButton = find(by.css('.file-tree__item-options-panel tractor-action[action="Delete item"] button'));
    };
    TractorFileTreeItem.prototype.getName = function () {
        var self = this;
        var result;
        result = self.name.getText();
        return result;
    };
    TractorFileTreeItem.prototype.editName = function (newName) {
        var self = this;
        var result;
        result = self.optionsButton.click();
        result = result.then(function () {
            return self.editNameButton.click();
        });
        result = result.then(function () {
            return browser.sendDeleteKey();
        });
        result = result.then(function () {
            return self.editNameInput.sendKeys(newName);
        });
        result = result.then(function () {
            return browser.sendEnterKey();
        });
        result = result.then(function () {
            return browser.sleep(2000);
        });
        return result;
    };
    TractorFileTreeItem.prototype.open = function () {
        var self = this;
        var result;
        result = self.name.click();
        return result;
    };
    TractorFileTreeItem.prototype.statusText = function () {
        var self = this;
        var result;
        result = self.name.getBeforeContent();
        return result;
    };
    return TractorFileTreeItem;
}();