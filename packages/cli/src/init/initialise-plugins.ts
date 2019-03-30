// Dependencies:
import { inject } from '@tractor/dependency-injection';
import { info } from '@tractor/logger';
import { Tractor } from '@tractor/tractor';

export const initialisePlugins = inject(async (tractor: Tractor): Promise<Array<void>> => Promise.all(
    tractor.plugins.map(plugin => {
        info(`Initialising tractor-plugin-${plugin.name}...`);
        // HACK:
        // Here's another reason to kill the custom DI stuff:
        // tslint:disable-next-line:no-unbound-method
        return tractor.call(plugin.init);
    })
), 'tractor');
