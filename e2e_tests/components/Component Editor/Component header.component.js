/*{
    "name": "Component header",
    "elements": [
        {
            "name": "Name"
        },
        {
            "name": "Name input"
        },
        {
            "name": "Name validation"
        },
        {
            "name": "Save button"
        },
        {
            "name": "hi jeremy"
        }
    ],
    "actions": [
        {
            "name": "get name",
            "parameters": []
        },
        {
            "name": "set name",
            "parameters": [
                {
                    "name": "name"
                }
            ]
        },
        {
            "name": "get validation",
            "parameters": []
        },
        {
            "name": "save",
            "parameters": []
        }
    ]
}*/
module.exports = function () {
    var ComponentHeader = function ComponentHeader() {
        this.name = element(by.css('.file-options__name'));
        this.nameInput = element(by.css('tractor-variable-input[model="componentEditor.fileModel"][label="Name"] input'));
        this.nameValidation = element(by.css('tractor-variable-input[model="componentEditor.fileModel"][label="Name"] [ng-messages]'));
        this.saveButton = element(by.css('tractor-submit[action="Save component file"]'));
    };
    ComponentHeader.prototype.getName = function () {
        var self = this;
        return self.name.getText();
    };
    ComponentHeader.prototype.setName = function (name) {
        var self = this;
        return self.nameInput.sendKeys(name);
    };
    ComponentHeader.prototype.getValidation = function () {
        var self = this;
        return self.nameValidation.getText();
    };
    ComponentHeader.prototype.save = function () {
        var self = this;
        return self.saveButton.click();
    };
    return ComponentHeader;
}();
