export function addInputHelpers () {
    let { ElementFinder } = global.protractor;

    ElementFinder.prototype.getInputValue = function () {
        return this.getAttribute('value');
    };
}
