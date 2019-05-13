// Dependencies:
import { Context, useMochaHook } from '@phenomnomnominal/protractor-use-mocha-hook';
import { setSizeFromName } from '../set-size-from-tags';

export function setupMocha (): void {
    // use `function` over `=>` to let Mocha set `this`:
    useMochaHook('beforeEach', async function (this: Context): Promise<void> {
        return setSizeFromName(this.currentTest!.title);
    });
}
