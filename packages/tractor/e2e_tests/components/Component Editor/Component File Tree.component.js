/*{
    "name": "Component file tree",
    "elements": [
        {
            "name": "header"
        },
        {
            "name": "first Component"
        }
    ],
    "actions": [
        {
            "name": "get first Component name",
            "parameters": []
        },
        {
            "name": "open first Component",
            "parameters": []
        }
    ]
}*/
module.exports = function () {
    var ComponentFileTree = function ComponentFileTree() {
        this.header = element(by.binding('fileTree.headerName'));
        this.firstComponent = element.all(by.repeater('item in (item || fileTree.model.fileStructure).files')).get(0).element(by.css('p'));
    };
    ComponentFileTree.prototype.getFirstComponentName = function () {
        var self = this;
        return self.firstComponent.getText();
    };
    ComponentFileTree.prototype.openFirstComponent = function () {
        var self = this;
        return self.firstComponent.click();
    };
    return ComponentFileTree;
}();