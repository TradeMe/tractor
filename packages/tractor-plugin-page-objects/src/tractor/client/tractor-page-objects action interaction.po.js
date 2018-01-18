/*{"name":"tractor-page-objects action interaction","elements":[{"name":"element select"},{"name":"group selector"},{"name":"action select"},{"name":"arguments","type":"tractor-page-objects action interaction argument"}],"actions":[{"name":"create interaction","parameters":[{"name":"element"},{"name":"action"}]},{"name":"create argument","parameters":[{"name":"name"},{"name":"value"}]}],"version":"0.5.0"}*/
module.exports = function () {
    var TractorPageObjectsActionInteractionArgument = require('./tractor-page-objects action interaction argument.po.js');
    var TractorPageObjectsActionInteraction = function TractorPageObjectsActionInteraction(parent) {
        var find = parent ? parent.element.bind(parent) : element;
        this.elementSelect = find(by.css('tractor-select[label="Element"] select'));
        this.groupSelector = find(by.css('tractor-literal-input[name="interaction.selector.name"] input'));
        this.actionSelect = find(by.css('tractor-select[label="Action"] select'));
        this.arguments = function (groupSelector) {
            return new TractorPageObjectsActionInteractionArgument(find.all(by.css('tractor-literal-input[name="argument.name"]')).getFromGroup(groupSelector));
        };
    };
    TractorPageObjectsActionInteraction.prototype.createInteraction = function (element, action) {
        var self = this;
        var result;
        result = self.elementSelect.selectOptionByText(element);
        result = result.then(function () {
            return self.actionSelect.selectOptionByText(action);
        });
        return result;
    };
    TractorPageObjectsActionInteraction.prototype.createArgument = function (name, value) {
        var self = this;
        var result;
        result = self.arguments(name).setValue(value);
        return result;
    };
    return TractorPageObjectsActionInteraction;
}();
