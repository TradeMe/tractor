/*{
    "name": "Component File Tree",
    "elements": [
        {
            "name": "title"
        },
        {
            "name": "list of component files"
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
        this.title = element(by.css('.file-tree h3'));
        this.listOfComponentFiles = element.all(by.repeater('componentFileName in componentEditor.componentFileNames'));
        this.exampleComponentFile = element.all(by.repeater('componentFileName in componentEditor.componentFileNames')).filter(function (element) {
            return element.getText().then(function (text) {
                return text.indexOf('ExampleComponent') !== -1;
            });
        }).get(0);
    };
    ComponentFileTree.prototype.getTitleText = function () {
        var self = this;
        return self.title.getInnerHtml();
    };
    ComponentFileTree.prototype.openExampleComponent = function () {
        var self = this;
        return self.exampleComponentFile.click();
    };
    return ComponentFileTree;
}();