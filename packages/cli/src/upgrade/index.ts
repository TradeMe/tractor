// Dependencies:
import { inject } from '@tractor/dependency-injection';
import { info } from '@tractor/logger';
import { Tractor } from '@tractor/tractor';

export const upgrade = inject(async (tractor: Tractor): Promise<Array<void>> => Promise.all(
    tractor.plugins.map(plugin => {
        info(`Upgrading tractor-plugin-${plugin.name} files...`);
        // HACK:
        // Here's another reason to kill the custom DI stuff:
        // tslint:disable-next-line:no-unbound-method
        return tractor.call(plugin.upgrade);
    })
) , 'tractor');
