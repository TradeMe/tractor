/*{"name":"tractor-page-objects action interaction argument","elements":[{"name":"input"},{"name":"name"}],"actions":[{"name":"set value","parameters":[{"name":"value"}]},{"name":"get name","parameters":[]},{"name":"get value","parameters":[]}],"version":"0.5.0"}*/
module.exports = function () {
    var TractorPageObjectsActionInteractionArgument = function TractorPageObjectsActionInteractionArgument(parent) {
        var find = parent ? parent.element.bind(parent) : element;
        this.input = find(by.css('input'));
        this.name = find(by.css('label'));
    };
    TractorPageObjectsActionInteractionArgument.prototype.setValue = function (value) {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.input.sendKeys(value);
        });
        return result;
    };
    TractorPageObjectsActionInteractionArgument.prototype.getName = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.name.getText();
        });
        return result;
    };
    TractorPageObjectsActionInteractionArgument.prototype.getValue = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.input.getInputValue();
        });
        return result;
    };
    return TractorPageObjectsActionInteractionArgument;
}();