// Dependencies:
import { TractorPlugin } from '@tractor/plugin-loader';
import { ScreenSize } from './tractor/server/screen-size/screen-size';

// Config:
import { getConfig } from '@tractor/config-loader';
import { config } from './tractor/config';

config(getConfig());

// Plugin:
export { plugin } from './protractor/plugin';

export { create } from './tractor/server/create';
export { description } from './tractor/server/description';

export type TractorScreenSizePlugin = TractorPlugin<ScreenSize>;
