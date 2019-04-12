// Dependencies:
import { TractorDescription, TractorPlugin, TractorPluginInternal } from '@tractor/plugin-loader';
import { Config } from 'protractor';
import { TractorBrowser } from './tractor-browser';

// Plugin:
import { plugin } from './protractor/plugin';
import { description } from './tractor/server/description';

export class Plugin implements TractorPluginInternal<TractorBrowser> {
    public readonly description: TractorDescription;

    constructor (
        private readonly _browser: TractorBrowser
    ) {
        this.description = description;
    }
    
    plugin (protractorConfig: Config): Config {
        return plugin(protractorConfig);
    }

    create (): TractorBrowser {
        return this._browser as TractorBrowser;
    }
}

export type TractorBrowserPlugin = TractorPlugin<TractorBrowser>;
