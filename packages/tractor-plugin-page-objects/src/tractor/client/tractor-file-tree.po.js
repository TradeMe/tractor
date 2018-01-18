/*{"name":"tractor-file-tree","elements":[{"name":"page object file","type":"tractor-file-tree item"}],"actions":[{"name":"open file","parameters":[{"name":"selector"}]},{"name":"get name","parameters":[{"name":"selector"}]},{"name":"edit name","parameters":[{"name":"selector"},{"name":"new name"}]},{"name":"status text","parameters":[{"name":"selector"}]}],"version":"0.5.0"}*/
module.exports = function () {
    var TractorFileTreeItem = require('./tractor-file-tree item.po.js');
    var TractorFileTree = function TractorFileTree(parent) {
        var find = parent ? parent.element.bind(parent) : element;
        this.pageObjectFile = function (groupSelector) {
            return new TractorFileTreeItem(find.all(by.css('.file-tree__item--page-object')).getFromGroup(groupSelector));
        };
    };
    TractorFileTree.prototype.openFile = function (selector) {
        var self = this;
        var result;
        result = self.pageObjectFile(selector).open();
        return result;
    };
    TractorFileTree.prototype.getName = function (selector) {
        var self = this;
        var result;
        result = self.pageObjectFile(selector).getName();
        return result;
    };
    TractorFileTree.prototype.editName = function (selector, newName) {
        var self = this;
        var result;
        result = self.pageObjectFile(selector).editName(newName);
        return result;
    };
    TractorFileTree.prototype.statusText = function (selector) {
        var self = this;
        var result;
        result = self.pageObjectFile(selector).statusText();
        return result;
    };
    return TractorFileTree;
}();
