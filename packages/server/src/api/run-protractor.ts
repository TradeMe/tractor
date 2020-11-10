// Utilities:
import { TractorConfigInternal } from '@tractor/config-loader';
import { error, info } from '@tractor/logger';
import { Tractor, TractorProtractorParams } from '@tractor/tractor';
import * as childProcess from 'child_process';
import * as path from 'path';
import { Config as ProtractorConfig } from 'protractor';
import { Socket } from 'socket.io';

// Constants:
const PROTRACTOR_CONFIG_FILE = 'protractor.conf.js';
const PROTRACTOR_PATH = path.resolve(require.resolve('protractor'), '../../bin/protractor');
const ENABLE_DEBUGGER = '--inspect-brk';
const NODE_COMMAND = 'node';

// Errors:
import { TractorError } from '@tractor/error-handler';

export let running = false;

export function runProtractorHandler (tractor: Tractor): (socket: Socket) => void {
    return function (socket: Socket): void {
        socket.on('run', async (runOptions: ProtractorConfig) => run(tractor.config, socket, runOptions));
    };
}

export async function run (config: TractorConfigInternal, socket: Socket, runOptions: ProtractorConfig): Promise<void> {
    if (running) {
        info('Protractor already running.');
        throw new TractorError('Protractor already running.');
    }

    running = true;

    try {
        await config.beforeProtractor();
        info('Starting Protractor...');
        await startProtractor(config, socket, runOptions);
    } catch (e) {
        error((e as Error).message);
    } finally {
        socket.disconnect();
        await config.afterProtractor();
        running = false;
        info('Protractor finished.');
    }
}

async function startProtractor (config: TractorConfigInternal, socket: Socket, options: ProtractorConfig): Promise<unknown> {
    const { baseUrl, params } = options;
    if (!baseUrl) {
        throw new TractorError('`baseUrl` must be defined.');
    }

    const protractorConfigPath = path.join(config.directory, PROTRACTOR_CONFIG_FILE);
    const protractorArgs = [PROTRACTOR_PATH, protractorConfigPath].concat(toArgs(options));
    if (params && (params as TractorProtractorParams).debug) {
        protractorArgs.unshift(ENABLE_DEBUGGER);
    }

    protractorArgs.unshift('--max-http-header-size=80000');

    const protractor = childProcess.spawn(NODE_COMMAND, protractorArgs);

    protractor.stdout.on('data', (data: Buffer) => {
        sendDataToClient(socket, data);
    });
    protractor.stderr.on('data', (data: Buffer) => {
        sendDataToClient(socket, data);
    });
    protractor.stdout.pipe(process.stdout);
    protractor.stderr.pipe(process.stderr);

    // HACK:
    // Types are hard:
    // tslint:disable:no-any
    type Func<T extends Array<any>> = (...args: T) => any;
    type Head<T extends Array<any>> = Func<T> extends ((head: infer R, ...rest: T) => any) ? R : never;
    type Tail<T extends Array<any>> = Func<T> extends ((head: any, ...rest: infer R) => any) ? R : never;
    // tslint:disable:no-any

    type PromiseParameters = Parameters<Head<ConstructorParameters<typeof Promise>>>;
    let resolve: Head<PromiseParameters>;
    let reject: Head<Tail<PromiseParameters>>;
    // tslint:disable ban-ts-ignore
    // @ts-ignore TS2345
    const deferred = new Promise<{}>((...args: PromiseParameters): void => {
        [resolve, reject] = args;
    });

    protractor.on('error', e => {
        reject(new TractorError(e.message));
    });
    protractor.on('exit', code => {
        if (code) {
            reject(new TractorError('Protractor Exit Error - '));
        } else {
            resolve();
        }
    });
    return deferred;
}

function toArgs (params: Record<string, unknown> | string, parent: string = ''): Array<string> {
    let args: Array<string> = [];
    Object.keys(params).forEach(param => {
        const value = params[param as keyof typeof params];
        if (Array.isArray(value) || typeof value === 'object') {
            args = args.concat(toArgs(value as Record<string, unknown>, parent ? `${parent}.${param}.` : `${param}.`));
            return;
        }
        args = args.concat([`--${parent}${param}`, (value as string)]);
    });
    return args;
}

function sendDataToClient (socket: Socket, data: Buffer): void {
    socket.emit('protractor-out', data.toString());
}
