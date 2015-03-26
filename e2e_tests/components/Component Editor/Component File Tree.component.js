/*{
    "name": "Component File Tree",
    "elements": [
        {
            "name": "title"
        },
        {
            "name": "example component file"
        },
        {
            "name": "root add directory button"
        }
    ],
    "actions": [
        {
            "name": "get title text",
            "parameters": []
        },
        {
            "name": "open example component",
            "parameters": []
        },
        {
            "name": "add directory",
            "parameters": []
        }
    ]
}*/
module.exports = function () {
    var ComponentFileTree = function ComponentFileTree() {
        this.title = element(by.css('.file-tree h2'));
        this.exampleComponentFile = element.all(by.repeater('item in (item || fileTree.model.fileStructure).files')).filter(function (element) {
            return element.getText().then(function (text) {
                return text.indexOf('Example Component') !== -1;
            });
        }).get(0);
        this.rootAddDirectoryButton = element(by.css('.file-tree > .file-tree__file-list > li > tractor-action[action="Add directory"]'));
    };
    ComponentFileTree.prototype.getTitleText = function () {
        var self = this;
        return self.title.getText();
    };
    ComponentFileTree.prototype.openExampleComponent = function () {
        var self = this;
        return self.exampleComponentFile.click();
    };
    ComponentFileTree.prototype.addDirectory = function () {
        var self = this;
        return self.rootAddDirectoryButton.click();
    };
    return ComponentFileTree;
}();