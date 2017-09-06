export default function addHooks () {
    let { by, ElementFinder } = global.protractor;
    ElementFinder.prototype.selectOptionText = function (text) {
        return this.all(by.cssContainingText('option', text)).get(0).click();
    };
    ElementFinder.prototype.selectOptionIndex = function (index) {
        return this.all(by.tagName('option')).then(options => options[index].click());
    };
}
