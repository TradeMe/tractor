// Config:
import { getConfig } from '@tractor/config-loader';
import { TractorPlugin } from '@tractor/plugin-loader';
import { config } from './plugin/config';

config(getConfig());

// Plugin:
export { plugin } from './plugin/plugin';

// UI:
export { init } from './ui/server/init';
export { run } from './ui/server/run';
export { serve } from './ui/server/serve';

// Upgrade:
export { upgrade } from './upgrade';

export type TractorMochaSpecsPlugin = TractorPlugin<void>;
