// Dependencies:
import { ProtractorBrowser } from 'protractor';

type TractorSubsetProtractorBrowserMethods = 'get' | 'refresh' | 'setLocation' | 'getCurrentUrl' | 'waitForAngular' | 'sleep' | 'pause';
export type TractorSubsetProtractorBrowser = Pick<ProtractorBrowser, TractorSubsetProtractorBrowserMethods>;

export type TractorBrowser = TractorSubsetProtractorBrowser & {
    focusNext (): Promise<void>;
    focusPrevious (): Promise<void>;
    sendDeleteKey (): Promise<void>;
    sendEnterKey (): Promise<void>;
    sendSpaceKey (): Promise<void>;
};
