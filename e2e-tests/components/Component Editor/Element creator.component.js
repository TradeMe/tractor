/*{
    "name": "Element creator",
    "elements": [
        {
            "name": "add element button"
        },
        {
            "name": "element name input"
        },
        {
            "name": "element name validation"
        },
        {
            "name": "element type select - model"
        },
        {
            "name": "element type select - binding"
        },
        {
            "name": "element type select - text"
        },
        {
            "name": "element type select - css"
        },
        {
            "name": "element type select - options"
        },
        {
            "name": "element type select - repeater"
        },
        {
            "name": "element locator input"
        },
        {
            "name": "element locator validation"
        },
        {
            "name": "add filter button"
        },
        {
            "name": "firstElement"
        },
        {
            "name": "firstElementName"
        }
    ],
    "actions": [
        {
            "name": "create element - model",
            "parameters": [
                {
                    "name": "name"
                },
                {
                    "name": "locator"
                }
            ]
        },
        {
            "name": "get first Element name",
            "parameters": []
        }
    ]
}*/
module.exports = function () {
    var ElementCreator = function ElementCreator() {
        this.addElementButton = element(by.css('tractor-action[model="componentEditor.fileModel"][action="Add element"] button'));
        this.elementNameInput = element(by.css('tractor-variable-input[model="domElement"][label="Name"] input'));
        this.elementNameValidation = element(by.css('tractor-variable-input[model="domElement"][label="Name"] [ng-messages]'));
        this.elementTypeSelectModel = element.all(by.options('option for option in selectOptions')).filter(function (element) {
            return element.getText().then(function (text) {
                return text.indexOf('model') !== -1;
            });
        }).get(0);
        this.elementTypeSelectBinding = element.all(by.options('option for option in selectOptions')).filter(function (element) {
            return element.getText().then(function (text) {
                return text.indexOf('binding') !== -1;
            });
        }).get(0);
        this.elementTypeSelectText = element.all(by.options('option for option in selectOptions')).filter(function (element) {
            return element.getText().then(function (text) {
                return text.indexOf('text') !== -1;
            });
        }).get(0);
        this.elementTypeSelectCss = element.all(by.options('option for option in selectOptions')).filter(function (element) {
            return element.getText().then(function (text) {
                return text.indexOf('css') !== -1;
            });
        }).get(0);
        this.elementTypeSelectOptions = element.all(by.options('option for option in selectOptions')).filter(function (element) {
            return element.getText().then(function (text) {
                return text.indexOf('options') !== -1;
            });
        }).get(0);
        this.elementTypeSelectRepeater = element.all(by.options('option for option in selectOptions')).filter(function (element) {
            return element.getText().then(function (text) {
                return text.indexOf('repeater') !== -1;
            });
        }).get(0);
        this.elementLocatorInput = element(by.css('tractor-text-input[model="domElement.selector"][label="Locator"] input'));
        this.elementLocatorValidation = element(by.css('tractor-text-input[model="domElement.selector"][label="Locator"] [ng-messages]'));
        this.addFilterButton = element(by.css('tractor-action[model="domElement"][action="Add filter"] button'));
        this.firstElement = element.all(by.repeater('domElement in componentEditor.fileModel.domElements')).get(0);
        this.firstElementName = element.all(by.repeater('domElement in componentEditor.fileModel.domElements')).get(0).element(by.css('tractor-variable-input[model="domElement"][label="Name"] input'));
    };
    ElementCreator.prototype.createElementModel = function (name, locator) {
        var self = this;
        return self.addElementButton.click().then(function () {
            return self.elementNameInput.sendKeys(name);
        }).then(function () {
            return self.elementTypeSelectModel.click();
        }).then(function () {
            return self.elementLocatorInput.sendKeys(locator);
        });
    };
    ElementCreator.prototype.getFirstElementName = function () {
        var self = this;
        return self.firstElementName.getText();
    };
    return ElementCreator;
}();