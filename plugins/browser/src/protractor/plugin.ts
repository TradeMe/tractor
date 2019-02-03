// Dependencies:
import { Config, Ptor } from 'protractor';
import { addKeyboardHelpers } from './helpers/keyboard-helpers';

export function plugin (protractorConfig: Config): Config {
    protractorConfig.plugins = protractorConfig.plugins || [];

    protractorConfig.plugins.push({
        inline: {
            onPrepare (): void {
                // HACK:
                // Use `any` to read `protractor` off global. Have to do
                // weitrd shit in `onPrepare` to get access to the global
                // `browser` object only after it has been created. Feels
                // like it would be better to use `require` directly here,
                // and use `proxyquire` in the tests maybe?
                // tslint:disable-next-line:no-any
                const { browser } = (global as any).protractor as Ptor;
                addKeyboardHelpers(browser);
            }
        }
    });

    return protractorConfig;
}
