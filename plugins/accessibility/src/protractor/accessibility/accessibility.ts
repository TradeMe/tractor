// Dependencies:
// tslint:disable-next-line
const AxeBuilder = require('axe-webdriverjs');
// tslint:disable-next-line
const AxeReports = require('axe-reports');
import { error } from '@tractor/logger';
import { AxeAnalysis } from 'axe-webdriverjs';
import * as path from 'path';
import { ProtractorBrowser, Key } from 'protractor';
import { TractorAccessibilityConfigInternal } from './accessibility-config';

export class Accessibility {
    public constructor (
        private readonly _browser: ProtractorBrowser,
        private readonly _config: TractorAccessibilityConfigInternal
    ) { }

    public async checkPage (name: string, threshold: number): Promise<boolean> {
        // tslint:disable
        return new Promise((resolve, reject) => {
            AxeBuilder(this._browser.driver as any)
            .analyze((e: Error | null, results: AxeAnalysis) => {
                if (e) {
                    error('Something went wrong while running accessibility audit!');
                    error(e.message);
                    reject(false);
                }

                // tslint:disable-next-line:no-console
                console.log(name, results.violations);
                this._handleResults(results);

                if (results.violations.length > threshold) {
                    reject(false);
                }
                resolve(true);
            });
        });
        // tslint:enable
    }

    public async checkSelector (name: string, selector: string, threshold: number): Promise<boolean> {
        // tslint:disable
        return new Promise((resolve, reject) => {
            AxeBuilder(this._browser.driver as any)
            .include(selector)
            .analyze((e: Error | null, results: AxeAnalysis) => {
                if (e) {
                    error('Something went wrong while running accessibility audit!');
                    error(e.message);
                    reject(false);
                }

                // tslint:disable-next-line:no-console
                console.log(name, results.violations);
                this._handleResults(results);

                if (results.violations.length > threshold) {
                    reject(false);
                }
                resolve(true);
            });
        });
        // tslint:enable
    }

    public async focusNext (): Promise<void> {
        return this._sendKeyAction(Key.TAB);
    }

    public async focusPrevious (): Promise<void> {
        return this._sendKeyAction(Key.SHIFT, Key.TAB);
    }

    public async pressDown (): Promise<void> {
        return this._sendKeyAction(Key.DOWN);
    }

    public async pressEnter (): Promise<void> {
        return this._sendKeyAction(Key.ENTER);
    }

    public async pressSpace (): Promise<void> {
        return this._sendKeyAction(Key.SPACE);
    }

    public async pressUp (): Promise<void> {
        return this._sendKeyAction(Key.UP);
    }

    private _handleResults (results: AxeAnalysis): void {
        AxeReports.processResults(results, 'csv', require('path').resolve(process.cwd(), this._config.accessibility.reportsDirectory, 'accessibility'), true);
    }

    private async _sendKeyAction (...keys: Array<string>): Promise<void> {
        return this._browser.actions().sendKeys(Key.chord(...keys)).perform() as Promise<void>;
    }
}
