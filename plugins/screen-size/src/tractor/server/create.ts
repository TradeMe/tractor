// Dependencies:
import { inject } from '@tractor/dependency-injection';
import { ProtractorBrowser } from 'protractor';
import { TractorScreenSizeConfigInternal } from '../screen-size-config';
import { ScreenSize } from './screen-size/screen-size';

export const create = inject((
    browser: ProtractorBrowser,
    config: TractorScreenSizeConfigInternal
): ScreenSize => new ScreenSize(browser, config), 'browser', 'config');
