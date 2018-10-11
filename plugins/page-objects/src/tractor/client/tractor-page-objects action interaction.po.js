/*{"name":"tractor-page-objects action interaction","elements":[{"name":"element select"},{"name":"group selector"},{"name":"action select"},{"name":"arguments","type":"tractor-page-objects action interaction argument","group":true}],"actions":[{"name":"add interaction","parameters":[{"name":"element"},{"name":"action"}]},{"name":"select element","parameters":[{"name":"element"}]},{"name":"select action","parameters":[{"name":"action"}]},{"name":"add argument","parameters":[{"name":"name"},{"name":"value"}]},{"name":"get element","parameters":[]},{"name":"get action","parameters":[]}],"version":"0.7.0"}*/
module.exports = function () {
    var TractorPageObjectsActionInteractionArgument = require('./tractor-page-objects action interaction argument.po.js');
    var TractorPageObjectsActionInteraction = function TractorPageObjectsActionInteraction(host) {
        var find = host ? host.element.bind(host) : element;
        var findAll = host ? host.all.bind(host) : element.all.bind(element);
        this.elementSelect = find(by.css('tractor-select[label="Element"] select'));
        this.groupSelector = find(by.css('tractor-literal-input[name="interaction.selector.name"] input'));
        this.actionSelect = find(by.css('tractor-select[label="Action"] select'));
        this.arguments = function (groupSelector) {
            return new TractorPageObjectsActionInteractionArgument(findAll(by.css('tractor-literal-input[name="argument.name"]')).getFromGroup(groupSelector));
        };
    };
    TractorPageObjectsActionInteraction.prototype.addInteraction = function (element, action) {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.elementSelect.selectOptionByText(element);
        });
        result = result.then(function () {
            return self.actionSelect.selectOptionByText(action);
        });
        return result;
    };
    TractorPageObjectsActionInteraction.prototype.selectElement = function (element) {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.elementSelect.selectOptionByText(element);
        });
        return result;
    };
    TractorPageObjectsActionInteraction.prototype.selectAction = function (action) {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.actionSelect.selectOptionByText(action);
        });
        return result;
    };
    TractorPageObjectsActionInteraction.prototype.addArgument = function (name, value) {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.arguments(name).setValue(value);
        });
        return result;
    };
    TractorPageObjectsActionInteraction.prototype.getElement = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.elementSelect.getSelectedOptionText();
        });
        return result;
    };
    TractorPageObjectsActionInteraction.prototype.getAction = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.actionSelect.getSelectedOptionText();
        });
        return result;
    };
    return TractorPageObjectsActionInteraction;
}();