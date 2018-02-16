export function addActionHelpers () {
    let { browser, Key } = global.protractor;

    browser.sendDeleteKey = function () {
        return sendKeyAction(Key.DELETE);
    }

    browser.sendEnterKey = function () {
        return sendKeyAction(Key.ENTER);
    }

    function sendKeyAction (key) {
        return browser.actions().sendKeys(key).perform();
    }
}
