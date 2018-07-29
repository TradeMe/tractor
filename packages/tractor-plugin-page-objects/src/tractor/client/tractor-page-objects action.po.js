/*{"name":"tractor-page-objects action","elements":[{"name":"name input"},{"name":"name validation"},{"name":"remove action button"},{"name":"add parameter button"},{"name":"parameters","type":"tractor-page-objects action parameter"},{"name":"add interaction button"},{"name":"interactions","type":"tractor-page-objects action interaction"}],"actions":[{"name":"add action","parameters":[{"name":"name"}]},{"name":"add parameter","parameters":[{"name":"name"}]},{"name":"add interaction","parameters":[{"name":"element"},{"name":"action"}]},{"name":"add argument","parameters":[{"name":"name"},{"name":"value"}]},{"name":"get name","parameters":[]},{"name":"get name validation","parameters":[]}],"version":"0.5.2"}*/
module.exports = function () {
    var TractorPageObjectsActionParameter = require('./tractor-page-objects action parameter.po.js');
    var TractorPageObjectsActionInteraction = require('./tractor-page-objects action interaction.po.js');
    var TractorPageObjectsAction = function TractorPageObjectsAction(parent) {
        var find = parent ? parent.element.bind(parent) : element;
        var findAll = parent ? parent.all.bind(parent) : element.all.bind(element);
        this.nameInput = find(by.css('tractor-variable-input[label="Name"] input'));
        this.nameValidation = find(by.css('tractor-variable-input[label="Name"] ng-message'));
        this.removeActionButton = find(by.css('tractor-action[action="Remove action"] button'));
        this.addParameterButton = find(by.css('tractor-action[action="Add parameter"] button'));
        this.parameters = function (groupSelector) {
            return new TractorPageObjectsActionParameter(findAll(by.css('ol[ng-model="action.parameters"] li')).getFromGroup(groupSelector));
        };
        this.addInteractionButton = find(by.css('tractor-action[action="Add interaction"] button'));
        this.interactions = function (groupSelector) {
            return new TractorPageObjectsActionInteraction(findAll(by.css('ol[ng-model="action.interactions"] li')).getFromGroup(groupSelector));
        };
    };
    TractorPageObjectsAction.prototype.addAction = function (name) {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.nameInput.sendKeys(name);
        });
        return result;
    };
    TractorPageObjectsAction.prototype.addParameter = function (name) {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.addParameterButton.click();
        });
        result = result.then(function () {
            return self.parameters('last').addParameter(name);
        });
        return result;
    };
    TractorPageObjectsAction.prototype.addInteraction = function (element, action) {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.interactions('last').addInteraction(element, action);
        });
        return result;
    };
    TractorPageObjectsAction.prototype.addArgument = function (name, value) {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.interactions('last').addArgument(name, value);
        });
        return result;
    };
    TractorPageObjectsAction.prototype.getName = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.nameInput.getInputValue();
        });
        return result;
    };
    TractorPageObjectsAction.prototype.getNameValidation = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.nameValidation.getText();
        });
        return result;
    };
    return TractorPageObjectsAction;
}();