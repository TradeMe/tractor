// Config:
import { getConfig } from '@tractor/config-loader';
import { config } from './tractor/config';

config(getConfig());

// Plugin:
export { create } from './tractor/server/create';
export { description } from './tractor/server/description';
export { init } from './tractor/server/init';
export { serve } from './tractor/server/serve';

// Promisify:
import Promise from 'bluebird';
Promise.promisifyAll(require('graceful-fs'));

export * from './tractor/server/utilities';
export * from './tractor/server/screen-size/screen-size';
