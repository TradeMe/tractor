export function addPseudoElementHelpers () {
    let { browser, ElementFinder } = global.protractor;

    ElementFinder.prototype.getAfterContent = function () {
        return browser.executeScript(`return window.getComputedStyle(arguments[0], '::after').content`, this);
    };

    ElementFinder.prototype.getBeforeContent = function () {
        return browser.executeScript(`return window.getComputedStyle(arguments[0], '::before').content`, this);
    };
}
