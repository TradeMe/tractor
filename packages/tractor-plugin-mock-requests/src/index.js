// Config:
import { getConfig } from 'tractor-config-loader';
import { config } from './tractor/config';

config(getConfig());

// Plugin:
export { plugin } from './protractor/plugin';

export { create } from './tractor/server/create';
export { init } from './tractor/server/init';
export { run } from './tractor/server/run';
export { serve } from './tractor/server/serve';

// Promisify:
import Promise from 'bluebird';
Promise.promisifyAll(require('graceful-fs'));
