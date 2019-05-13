/*{"name":"tractor-mocha-specs assertion","elements":[{"name":"page object select"},{"name":"action select"},{"name":"arguments","type":"tractor-mocha-specs step argument","group":true},{"name":"expected result input"},{"name":"expected result validation"}],"actions":[{"name":"add assertion","parameters":[{"name":"page object"},{"name":"action"},{"name":"expected result"}]},{"name":"select page object","parameters":[{"name":"page object"}]},{"name":"select action","parameters":[{"name":"action"}]},{"name":"set expected result","parameters":[{"name":"expected result"}]},{"name":"add argument","parameters":[{"name":"name"},{"name":"value"}]},{"name":"get page object","parameters":[]},{"name":"get action","parameters":[]},{"name":"get expected result","parameters":[]},{"name":"get expected result validation","parameters":[]}],"version":"1.4.0"}*/
module.exports = function () {
    var TractorMochaSpecsStepArgument = require('./tractor-mocha-specs step argument.po.js');
    var TractorMochaSpecsAssertion = function TractorMochaSpecsAssertion(host) {
        var find = host ? host.element.bind(host) : element;
        var findAll = host ? host.all.bind(host) : element.all.bind(element);
        this.pageObjectSelect = find(by.css('tractor-select[label="Page Object"] select'));
        this.actionSelect = find(by.css('tractor-select[label="Action"] select'));
        this.arguments = function (groupSelector) {
            return new TractorMochaSpecsStepArgument(findAll(by.css('tractor-literal-input[name="argument.name"] input')).getFromGroup(groupSelector));
        };
        this.expectedResultInput = find(by.css('tractor-literal-input[name="step.expectedResult.name"] input'));
        this.expectedResultValidation = find(by.css('tractor-literal-input[name="step.expectedResult.name"] ng-message'));
    };
    TractorMochaSpecsAssertion.prototype.addAssertion = function (pageObject, action, expectedResult) {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.pageObjectSelect.selectOptionByText(pageObject);
        });
        result = result.then(function () {
            return self.actionSelect.selectOptionByText(action);
        });
        result = result.then(function () {
            return self.expectedResultInput.sendKeys(expectedResult);
        });
        return result;
    };
    TractorMochaSpecsAssertion.prototype.selectPageObject = function (pageObject) {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.pageObjectSelect.selectOptionByText(pageObject);
        });
        return result;
    };
    TractorMochaSpecsAssertion.prototype.selectAction = function (action) {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.actionSelect.selectOptionByText(action);
        });
        return result;
    };
    TractorMochaSpecsAssertion.prototype.setExpectedResult = function (expectedResult) {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.expectedResultInput.sendKeys(expectedResult);
        });
        return result;
    };
    TractorMochaSpecsAssertion.prototype.addArgument = function (name, value) {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.arguments(name).setValue(value);
        });
        return result;
    };
    TractorMochaSpecsAssertion.prototype.getPageObject = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.pageObjectSelect.getSelectedOptionText();
        });
        return result;
    };
    TractorMochaSpecsAssertion.prototype.getAction = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.actionSelect.getSelectedOptionText();
        });
        return result;
    };
    TractorMochaSpecsAssertion.prototype.getExpectedResult = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.expectedResultInput.getInputValue();
        });
        return result;
    };
    TractorMochaSpecsAssertion.prototype.getExpectedResultValidation = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.expectedResultValidation.getText();
        });
        return result;
    };
    return TractorMochaSpecsAssertion;
}();