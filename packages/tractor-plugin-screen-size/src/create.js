// Dependencies:
import { ScreenSize } from './screen-size/screen-size';

export function create (browser, config) {
    return new ScreenSize(browser, config);
}
