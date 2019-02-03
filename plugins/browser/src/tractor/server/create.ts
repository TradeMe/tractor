// Dependencies:
import { INJECTION, TractorDIFunc } from '@tractor/dependency-injection';
import { TractorBrowser } from '../../tractor-browser';

export const create: TractorDIFunc<TractorBrowser> = (browser: TractorBrowser): TractorBrowser => browser;
create[INJECTION] = ['browser'];
