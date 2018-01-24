// Dependencies:
import { parseOrdinal } from './ordinals';

export function addSelectHelpers () {
    let { by, ElementFinder } = global.protractor;

    ElementFinder.prototype.selectOptionByText = function (text) {
        return this.all(by.cssContainingText('option', text)).first().click();
    };

    ElementFinder.prototype.selectOptionByIndex = function (index) {
        index = parseOrdinal(index) || index;
        return this.all(by.tagName('option')).then(options => options[index].click());
    };

    ElementFinder.prototype.getSelectedOptionText = function () {
        return this.element(by.css('option:checked')).getText();
    };
}
