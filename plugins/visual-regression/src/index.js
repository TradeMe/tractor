// Polyfills:
import '@babel/polyfill';

// Config:
import { getConfig } from '@tractor/config-loader';
import { config } from './tractor/config';

config(getConfig());

export { create } from './tractor/server/create';
export { description } from './tractor/server/description';
export { init } from './tractor/server/init';
export { run } from './tractor/server/run';
export { serve } from './tractor/server/serve';
