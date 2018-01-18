/*{"name":"tractor-page-objects action interaction argument","elements":[{"name":"argument input"}],"actions":[{"name":"set value","parameters":[{"name":"value"}]}],"version":"0.5.0"}*/
module.exports = function () {
    var TractorPageObjectsActionInteractionArgument = function TractorPageObjectsActionInteractionArgument(parent) {
        var find = parent ? parent.element.bind(parent) : element;
        this.argumentInput = find(by.css('input'));
    };
    TractorPageObjectsActionInteractionArgument.prototype.setValue = function (value) {
        var self = this;
        var result;
        result = self.argumentInput.sendKeys(value);
        return result;
    };
    return TractorPageObjectsActionInteractionArgument;
}();