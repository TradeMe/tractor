/*{"name":"tractor-page-objects action","elements":[{"name":"name input"},{"name":"remove action button"},{"name":"add parameter button"},{"name":"add interaction button"}],"actions":[],"version":"0.5.0"}*/
module.exports = function () {
    var TractorPageObjectsAction = function TractorPageObjectsAction(parent) {
        var find = parent ? parent.element.bind(parent) : element;
        this.nameInput = find(by.css('tractor-variable-input[label="Name"] input'));
        this.removeActionButton = find(by.css('tractor-action[action="Remove action"] button'));
        this.addParameterButton = find(by.css('tractor-action[action="Add parameter"] button'));
        this.addInteractionButton = find(by.css('tractor-action[action="Add interaction"] button'));
    };
    return TractorPageObjectsAction;
}();