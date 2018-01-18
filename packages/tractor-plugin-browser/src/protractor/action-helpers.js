export function addActionHelpers () {
    let { browser, Key } = global.protractor;

    browser.sendDeleteKey = function () {
        return browser.actions().sendKeys(Key.DELETE).perform();
    }

    browser.sendEnterKey = function () {
        return browser.actions().sendKeys(Key.ENTER).perform();
    }
}
