// Dependencies:
import * as bodyParser from 'body-parser';
import { EventEmitter } from 'events';
import * as express from 'express';
import { Server } from 'http';
import * as io from 'socket.io';
import { promisify } from 'util';
import { serveFileStructure } from '../src/server';
import { FileStructure } from '../src/structure/file-structure';

export async function startTestServer (fileStructure: FileStructure, port: number): Promise<() => void> {
    const application = express();
    const server = new Server(application);
    const sockets = io(server);

    application.use(bodyParser.json());
    application.use(bodyParser.urlencoded({ extended: true }));

    const watcher = fileStructure.watch();
    serveFileStructure(application, sockets)(fileStructure);

    await new Promise((resolve): EventEmitter => watcher.on('ready', resolve));

    const listen = promisify(server.listen.bind(server));
    await listen(port);
    return async (): Promise<void> => {
        await promisify(server.close.bind(server));
        sockets.close();
        fileStructure.unwatch();
    };
}
