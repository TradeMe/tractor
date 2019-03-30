// Dependencies:
import { inject } from '@tractor/dependency-injection';
import { TractorBrowser } from '../../tractor-browser';

export const create = inject((browser: TractorBrowser): TractorBrowser => browser, 'browser');
