// Dependencies:
import { ElementFinder, Key, ProtractorBrowser } from 'protractor';
import { TractorBrowser } from '../../tractor-browser';

export function addKeyboardHelpers (browser: TractorBrowser | ProtractorBrowser): void {
    browser.focusNext = async function (): Promise<void> {
        return sendKeyAction(Key.TAB);
    };

    browser.focusPrevious = async function (): Promise<void> {
        return sendKeyAction(Key.SHIFT, Key.TAB);
    };

    browser.pasteText = async function (element: ElementFinder, text: string): Promise<void> {
        await element.click();
        await (browser as ProtractorBrowser).executeScript(`arguments[0].setAttribute('value', arguments[1]); arguments[0].value = arguments[1]`, element, text);
        await sendKeyAction(Key.DOWN);
        await element.sendKeys(' ');
        await (browser as TractorBrowser).sendDeleteKey();
    };

    browser.sendDeleteKey = async function (): Promise<void> {
        return sendKeyAction(Key.DELETE);
    };

    browser.sendEnterKey = async function (): Promise<void> {
        return sendKeyAction(Key.ENTER);
    };

    browser.sendSpaceKey = async function (): Promise<void> {
        return sendKeyAction(Key.SPACE);
    };

    async function sendKeyAction (...keys: Array<string>): Promise<void> {
        return (browser as ProtractorBrowser).actions().sendKeys(Key.chord(...keys)).perform() as Promise<void>;
    }
}
