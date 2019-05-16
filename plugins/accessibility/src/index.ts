// Dependencies:
import { TractorPlugin } from '@tractor/plugin-loader';
import { Accessibility } from './protractor/accessibility/accessibility';

// Config:
import { getConfig } from '@tractor/config-loader';
import { config } from './tractor/config';

config(getConfig());

// Plugin:
export { create } from './tractor/server/create';
export { description } from './tractor/server/description';

export type TractorBrowserPlugin = TractorPlugin<Accessibility>;
