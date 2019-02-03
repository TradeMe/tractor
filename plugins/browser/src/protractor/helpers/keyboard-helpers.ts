// Dependencies:
import { Key, ProtractorBrowser } from 'protractor';

export function addKeyboardHelpers (browser: ProtractorBrowser): void {
    browser.sendDeleteKey = async function (): Promise<void> {
        return sendKeyAction(Key.DELETE);
    };

    browser.sendEnterKey = async function (): Promise<void> {
        return sendKeyAction(Key.ENTER);
    };

    browser.sendSpaceKey = async function (): Promise<void> {
        return sendKeyAction(Key.SPACE);
    };

    browser.focusNext = async function (): Promise<void> {
        return sendKeyAction(Key.TAB);
    };

    browser.focusPrevious = async function (): Promise<void> {
        return sendKeyAction(Key.SHIFT, Key.TAB);
    };

    async function sendKeyAction (...keys: Array<string>): Promise<void> {
        return browser.actions().sendKeys(Key.chord(...keys)).perform() as Promise<void>;
    }
}
