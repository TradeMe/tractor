// Dependencies:
import { setSizeFromName } from '../set-size-from-tags';

// use `function` over `=>` for `this` binding:
beforeEach(function () {
    return setSizeFromName(this.currentTest.title);
});
