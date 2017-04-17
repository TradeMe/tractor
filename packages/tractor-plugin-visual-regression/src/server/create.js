// Dependencies:
import { VisualRegression } from './visual-regression/visual-regression';

export default function create (browser, config) {
    return new VisualRegression(browser, config);
}
create['@Inject'] = ['browser', 'config'];
