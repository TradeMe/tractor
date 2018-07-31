/*{"name":"tractor-mocha-specs interaction","elements":[{"name":"page object select"},{"name":"action select"},{"name":"arguments","type":"tractor-mocha-specs step argument"}],"actions":[{"name":"add interaction","parameters":[{"name":"page object"},{"name":"action"}]},{"name":"select page object","parameters":[{"name":"page object"}]},{"name":"select action","parameters":[{"name":"action"}]},{"name":"add argument","parameters":[{"name":"name"},{"name":"value"}]},{"name":"get page object","parameters":[]},{"name":"get action","parameters":[]}],"version":"0.5.2"}*/
module.exports = function () {
    var TractorMochaSpecsStepArgument = require('./tractor-mocha-specs step argument.po.js');
    var TractorMochaSpecsInteraction = function TractorMochaSpecsInteraction(parent) {
        var find = parent ? parent.element.bind(parent) : element;
        var findAll = parent ? parent.all.bind(parent) : element.all.bind(element);
        this.pageObjectSelect = find(by.css('tractor-select[label="Page Object"] select'));
        this.actionSelect = find(by.css('tractor-select[label="Action"] select'));
        this.arguments = function (groupSelector) {
            return new TractorMochaSpecsStepArgument(findAll(by.css('tractor-literal-input[name="argument.name"] input')).getFromGroup(groupSelector));
        };
    };
    TractorMochaSpecsInteraction.prototype.addInteraction = function (pageObject, action) {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.pageObjectSelect.selectOptionByText(pageObject);
        });
        result = result.then(function () {
            return self.actionSelect.selectOptionByText(action);
        });
        return result;
    };
    TractorMochaSpecsInteraction.prototype.selectPageObject = function (pageObject) {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.pageObjectSelect.selectOptionByText(pageObject);
        });
        return result;
    };
    TractorMochaSpecsInteraction.prototype.selectAction = function (action) {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.actionSelect.selectOptionByText(action);
        });
        return result;
    };
    TractorMochaSpecsInteraction.prototype.addArgument = function (name, value) {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.arguments(name).setValue(value);
        });
        return result;
    };
    TractorMochaSpecsInteraction.prototype.getPageObject = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.pageObjectSelect.getSelectedOptionText();
        });
        return result;
    };
    TractorMochaSpecsInteraction.prototype.getAction = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.actionSelect.getSelectedOptionText();
        });
        return result;
    };
    return TractorMochaSpecsInteraction;
}();