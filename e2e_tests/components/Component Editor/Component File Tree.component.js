/*{
    "name": "Component File Tree",
    "elements": [
        {
            "name": "title"
        },
        {
            "name": "example component file"
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
    };
    ComponentFileTree.prototype.getTitleText = function () {
        var self = this;
        return self.title.getText();
    };
    ComponentFileTree.prototype.openExampleComponent = function () {
        var self = this;
        return self.exampleComponentFile.click();
    };
    return ComponentFileTree;
}();