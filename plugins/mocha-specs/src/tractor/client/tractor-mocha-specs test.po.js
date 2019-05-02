/*{"name":"tractor-mocha-specs test","elements":[{"name":"name input"},{"name":"name validation"},{"name":"remove test button"},{"name":"only checkbox"},{"name":"skip checkbox"},{"name":"skip reason input"},{"name":"add interaction button"},{"name":"add assertion button"},{"name":"interactions","type":"tractor-mocha-specs interaction","group":true},{"name":"assertions","type":"tractor-mocha-specs assertion","group":true}],"actions":[{"name":"add test","parameters":[{"name":"name"}]},{"name":"toggle only","parameters":[]},{"name":"get only","parameters":[]},{"name":"toggle skip","parameters":[]},{"name":"get skip","parameters":[]},{"name":"set skip reason","parameters":[{"name":"skip reason"}]},{"name":"get skip reason","parameters":[]},{"name":"get name","parameters":[]},{"name":"get name validation","parameters":[]}],"version":"1.4.0"}*/
module.exports = function () {
    var TractorMochaSpecsInteraction = require('./tractor-mocha-specs interaction.po.js');
    var TractorMochaSpecsAssertion = require('./tractor-mocha-specs assertion.po.js');
    var TractorMochaSpecsTest = function TractorMochaSpecsTest(host) {
        var find = host ? host.element.bind(host) : element;
        var findAll = host ? host.all.bind(host) : element.all.bind(element);
        this.nameInput = find(by.css('tractor-text-input[label="Name"] input'));
        this.nameValidation = find(by.css('tractor-text-input[label="Name"] ng-message'));
        this.removeTestButton = find(by.css('tractor-action[action="Remove test"] button'));
        this.onlyCheckbox = find(by.css('tractor-checkbox[label="only"] input'));
        this.skipCheckbox = find(by.css('tractor-checkbox[label="skip"] input'));
        this.skipReasonInput = find(by.css('tractor-text-input[label="reason"] input'));
        this.addInteractionButton = find(by.css('tractor-action[action="Add interaction"] button'));
        this.addAssertionButton = find(by.css('tractor-action[action="Add assertion"] button'));
        this.interactions = function (groupSelector) {
            return new TractorMochaSpecsInteraction(findAll(by.css('li[ng-repeat="step in test.steps"]')).getFromGroup(groupSelector));
        };
        this.assertions = function (groupSelector) {
            return new TractorMochaSpecsAssertion(findAll(by.css('li[ng-repeat="step in test.steps"]')).getFromGroup(groupSelector));
        };
    };
    TractorMochaSpecsTest.prototype.addTest = function (name) {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.nameInput.sendKeys(name);
        });
        return result;
    };
    TractorMochaSpecsTest.prototype.toggleOnly = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.onlyCheckbox.click();
        });
        return result;
    };
    TractorMochaSpecsTest.prototype.getOnly = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.onlyCheckbox.isSelected();
        });
        return result;
    };
    TractorMochaSpecsTest.prototype.toggleSkip = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.skipCheckbox.click();
        });
        return result;
    };
    TractorMochaSpecsTest.prototype.getSkip = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.skipCheckbox.isSelected();
        });
        return result;
    };
    TractorMochaSpecsTest.prototype.setSkipReason = function (skipReason) {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.skipReasonInput.sendKeys(skipReason);
        });
        return result;
    };
    TractorMochaSpecsTest.prototype.getSkipReason = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.skipReasonInput.getInputValue();
        });
        return result;
    };
    TractorMochaSpecsTest.prototype.getName = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.nameInput.getInputValue();
        });
        return result;
    };
    TractorMochaSpecsTest.prototype.getNameValidation = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.nameValidation.getText();
        });
        return result;
    };
    return TractorMochaSpecsTest;
}();