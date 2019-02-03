// Dependencies:
import { TractorPlugin } from '@tractor/plugin-loader';
import { TractorBrowser } from './tractor-browser';

// Plugin:
export { plugin } from './protractor/plugin';

export { create } from './tractor/server/create';
export { description } from './tractor/server/description';

export type TractorBrowserPlugin = TractorPlugin<TractorBrowser>;
