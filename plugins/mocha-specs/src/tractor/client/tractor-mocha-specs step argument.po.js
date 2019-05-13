/*{"name":"tractor-mocha-specs step argument","elements":[{"name":"input"},{"name":"name"},{"name":"validation"}],"actions":[{"name":"set value","parameters":[{"name":"value"}]},{"name":"get name","parameters":[]},{"name":"get value","parameters":[]},{"name":"get validation","parameters":[]}],"version":"1.7.0"}*/
module.exports = function () {
    var TractorMochaSpecsStepArgument = function TractorMochaSpecsStepArgument(host) {
        var find = host ? host.element.bind(host) : element;
        this.input = find(by.css('input'));
        this.name = find(by.css('label'));
        this.validation = find(by.css('ng-message'));
    };
    TractorMochaSpecsStepArgument.prototype.setValue = function (value) {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.input.sendKeys(value);
        });
        return result;
    };
    TractorMochaSpecsStepArgument.prototype.getName = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.name.getText();
        });
        return result;
    };
    TractorMochaSpecsStepArgument.prototype.getValue = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.input.getInputValue();
        });
        return result;
    };
    TractorMochaSpecsStepArgument.prototype.getValidation = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.validation.getText();
        });
        return result;
    };
    return TractorMochaSpecsStepArgument;
}();