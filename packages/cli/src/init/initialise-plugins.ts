// Dependencies:
import { info } from '@tractor/logger';
import { Tractor } from '@tractor/tractor';

export async function initialisePlugins (tractor: Tractor): Promise<Array<void>> {
    return Promise.all(tractor.plugins.map(plugin => {
        info(`Initialising tractor-plugin-${plugin.name}...`);
        // HACK:
        // Here's another reason to kill the custom DI stuff:
        // tslint:disable-next-line:no-unbound-method
        return tractor.call(plugin.init);
    }));
}
