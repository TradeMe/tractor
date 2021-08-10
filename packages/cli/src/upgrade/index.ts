// Dependencies:
import { inject } from '@tractor/dependency-injection';
import { info } from '@tractor/logger';
import { Tractor } from '@tractor/tractor';

export const upgrade = inject(async (tractor: Tractor): Promise<void> => tractor.plugins.reduce(
    async (p, plugin) => {
        await p;
        info(`Upgrading @tractor-plugin/${plugin.name} files...`);
        // HACK:
        // Here's another reason to kill the custom DI stuff:
        // tslint:disable-next-line:no-unbound-method
        await tractor.call(plugin.upgrade);
    }, Promise.resolve())
, 'tractor');
