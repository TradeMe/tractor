// Dependencies:
import { INJECTION, TractorDIFunc } from '@tractor/dependency-injection';
import { ProtractorBrowser } from 'protractor';
import { TractorScreenSizeConfigInternal } from '../screen-size-config';
import { ScreenSize } from './screen-size/screen-size';

export function create (browser: ProtractorBrowser, config: TractorScreenSizeConfigInternal): ScreenSize {
    return new ScreenSize(browser, config);
}
(create as TractorDIFunc<ScreenSize>)[INJECTION] = ['browser', 'config'];
