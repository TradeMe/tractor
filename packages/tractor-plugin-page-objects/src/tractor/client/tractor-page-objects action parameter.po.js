/*{"name":"tractor-page-objects action parameter","elements":[{"name":"name input"},{"name":"remove parameter button"}],"actions":[{"name":"add parameter","parameters":[{"name":"name"}]},{"name":"remove parameter","parameters":[]}],"version":"0.5.0"}*/
module.exports = function () {
    var TractorPageObjectsActionParameter = function TractorPageObjectsActionParameter(parent) {
        var find = parent ? parent.element.bind(parent) : element;
        this.nameInput = find(by.css('tractor-variable-input[label="Name"] input'));
        this.removeParameterButton = find(by.css('tractor-action[action="Remove parameter"] button'));
    };
    TractorPageObjectsActionParameter.prototype.addParameter = function (name) {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.nameInput.sendKeys(name);
        });
        return result;
    };
    TractorPageObjectsActionParameter.prototype.removeParameter = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.removeParameterButton.click();
        });
        return result;
    };
    return TractorPageObjectsActionParameter;
}();
