// Dependencies:
import { ScreenSize } from './screen-size/screen-size';

export default function create (browser, config) {
    return new ScreenSize(browser, config);
}
create['@Inject'] = ['browser', 'config'];
