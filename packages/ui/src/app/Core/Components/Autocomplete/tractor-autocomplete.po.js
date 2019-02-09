/*{"name":"tractor-autocomplete","elements":[{"name":"label"},{"name":"input"},{"name":"options","group":true}],"actions":[{"name":"send keys","parameters":[{"name":"value"}]},{"name":"get input value","parameters":[]}],"version":"0.7.0"}*/
module.exports = function () {
    var TractorAutocomplete = function TractorAutocomplete(host) {
        var find = host ? host.element.bind(host) : element;
        var findAll = host ? host.all.bind(host) : element.all.bind(element);
        this.label = find(by.css('label'));
        this.input = find(by.css('input'));
        this.options = function (groupSelector) {
            return findAll(by.css('datalist option')).getFromGroup(groupSelector);
        };
    };
    TractorAutocomplete.prototype.sendKeys = function (value) {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.input.clear();
        });
        result = result.then(function () {
            return self.input.sendKeys(value);
        });
        result = result.then(function () {
            return browser.executeScript('return arguments[0].click()', self.options('1st'));
        });
        return result;
    };
    TractorAutocomplete.prototype.getInputValue = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.input.getInputValue();
        });
        return result;
    };
    return TractorAutocomplete;
}();
