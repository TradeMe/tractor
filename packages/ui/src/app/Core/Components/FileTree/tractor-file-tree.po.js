/*{"name":"tractor-file-tree","elements":[{"name":"page object file","type":"tractor-file-tree item","group":true}],"actions":[{"name":"open file","parameters":[{"name":"selector"}]},{"name":"edit file name","parameters":[{"name":"selector"},{"name":"new name"}]},{"name":"get file name","parameters":[{"name":"selector"}]},{"name":"get file status text","parameters":[{"name":"selector"}]}],"version":"1.4.0"}*/
module.exports = function () {
    var TractorFileTreeItem = require('./tractor-file-tree item.po.js');
    var TractorFileTree = function TractorFileTree(host) {
        var findAll = host ? host.all.bind(host) : element.all.bind(element);
        this.pageObjectFile = function (groupSelector) {
            return new TractorFileTreeItem(findAll(by.css('.file-tree__file-list-item--file')).getFromGroup(groupSelector));
        };
    };
    TractorFileTree.prototype.openFile = function (selector) {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.pageObjectFile(selector).open();
        });
        return result;
    };
    TractorFileTree.prototype.editFileName = function (selector, newName) {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.pageObjectFile(selector).editName(newName);
        });
        return result;
    };
    TractorFileTree.prototype.getFileName = function (selector) {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.pageObjectFile(selector).getName();
        });
        return result;
    };
    TractorFileTree.prototype.getFileStatusText = function (selector) {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.pageObjectFile(selector).getStatusText();
        });
        return result;
    };
    return TractorFileTree;
}();