// Dependencies:
import { INJECTION, TractorDIFunc } from '@tractor/dependency-injection';
import { TractorBrowser } from '../../tractor-browser';

export function create (browser: TractorBrowser): TractorBrowser {
    return browser;
}
(create as TractorDIFunc<TractorBrowser>)[INJECTION] = ['browser'];
