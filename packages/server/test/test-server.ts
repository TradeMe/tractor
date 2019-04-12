// Dependencies:
import { inject } from '@tractor/dependency-injection';
import { tractor } from '@tractor/tractor';
import { Server } from 'http';
import * as path from 'path';
import { Server as SocketServer } from 'socket.io';
import { promisify } from 'util';
import { init, start } from '../src/application';

export async function startTestServer (configPath: string, port: number): Promise<() => void> {
    const t = tractor(path.join( '../fixtures', configPath));
    t.config.port = port;
    const server = await init(t);
    await start(t, server);

    const close = inject(async function close (server: Server, sockets: SocketServer) {
        await promisify(server.close.bind(server))();
        sockets.close();
    }, 'server', 'sockets');

    return async (): Promise<void> => {
        await t.call(close);
    };
}

export async function timeout (time: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, time));
}
