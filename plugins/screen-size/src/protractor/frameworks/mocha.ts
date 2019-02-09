// Dependencies:
import { setSizeFromName } from '../set-size-from-tags';

// HACK:
// Have to manually declare some Mocha types as include
// @types/mocha causes conflicts with @types/jest...
type MochaTest = {
    title: string;
};

type MochaContext = {
    currentTest: MochaTest;
};

// use `function` over `=>` for `this` binding:
beforeEach(async function (this: MochaContext): Promise<void> {
    return setSizeFromName(this.currentTest.title);
});
