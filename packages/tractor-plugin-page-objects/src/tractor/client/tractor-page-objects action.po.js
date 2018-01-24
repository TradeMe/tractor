/*{"name":"tractor-page-objects action","elements":[{"name":"name input"},{"name":"remove action button"},{"name":"add parameter button"},{"name":"parameters"},{"name":"add interaction button"},{"name":"interactions"}],"actions":[{"name":"add action","parameters":[{"name":"name"}]},{"name":"add parameter","parameters":[{"name":"name"}]},{"name":"add interaction","parameters":[{"name":"element"},{"name":"action"}]},{"name":"add argument","parameters":[{"name":"name"},{"name":"value"}]},{"name":"get name","parameters":[]},{"name":"get interaction element","parameters":[]},{"name":"get interaction action","parameters":[]},{"name":"get interaction argument name","parameters":[{"name":"name"}]},{"name":"get interaction argument value","parameters":[{"name":"name"}]},{"name":"select interaction element","parameters":[{"name":"element"}]},{"name":"select interaction action","parameters":[{"name":"action"}]}],"version":"0.5.0"}*/
module.exports = function () {
    var TractorPageObjectsActionParameter = require('./tractor-page-objects action parameter.po.js');
    var TractorPageObjectsActionInteraction = require('./tractor-page-objects action interaction.po.js');
    var TractorPageObjectsAction = function TractorPageObjectsAction(parent) {
        var find = parent ? parent.element.bind(parent) : element;
        var findAll = parent ? parent.all.bind(parent) : element.all;
        this.nameInput = find(by.css('tractor-variable-input[label="Name"] input'));
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
    TractorPageObjectsAction.prototype.getInteractionElement = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.interactions('last').getElement();
        });
        return result;
    };
    TractorPageObjectsAction.prototype.getInteractionAction = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.interactions('last').getAction();
        });
        return result;
    };
    TractorPageObjectsAction.prototype.getInteractionArgumentName = function (name) {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.interactions('last').getArgumentName(name);
        });
        return result;
    };
    TractorPageObjectsAction.prototype.getInteractionArgumentValue = function (name) {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.interactions('last').getArgumentValue(name);
        });
        return result;
    };
    TractorPageObjectsAction.prototype.selectInteractionElement = function (element) {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.interactions('last').selectElement(element);
        });
        return result;
    };
    TractorPageObjectsAction.prototype.selectInteractionAction = function (action) {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.interactions('last').selectAction(action);
        });
        return result;
    };
    return TractorPageObjectsAction;
}();