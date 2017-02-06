// Dependencies:
import { ScreenSize } from './screen-size';

export default function create (browser, config) {
    return new ScreenSize(browser, config);
}
