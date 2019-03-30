// Dependencies:
import { inject } from '@tractor/dependency-injection';
import { info } from '@tractor/logger';
import { Express, Request, Response, static as expressStatic } from 'express';
import { Server } from 'socket.io';
import { FileStructure } from './structure/file-structure';

// Actions:
import { Action, ActionFactory } from './actions/action';
import { createDeleteItemHandler } from './actions/delete-item';
import { createMoveItemHandler } from './actions/move-item';
import { createOpenItemHandler } from './actions/open-item';
import { createRefactorItemHandler } from './actions/refactor-item';
import { createSaveItemHandler } from './actions/save-item';
import { watchFileStructure } from './actions/watch-file-structure';

export const serveFileStructure = inject((application: Express, sockets: Server): (fileStructure: FileStructure) => void => function (fileStructure: FileStructure): void {
    const createEndpoint = createEndpointFactory(fileStructure);
    const createItemEndpoint = createItemEndpointFactory(createEndpoint);
    const createItemAction = createItemActionFactory(fileStructure);

    const staticEndPoint = createEndpoint('/fs/static');
    info(`Serving "${fileStructure.path}" from "${staticEndPoint}".`);

    application.use(staticEndPoint, expressStatic(fileStructure.path));

    application.delete(createItemEndpoint('/fs'), createItemAction(createDeleteItemHandler));
    application.post(createItemEndpoint('/fs/move'), createItemAction(createMoveItemHandler));
    application.get(createItemEndpoint('/fs'), createItemAction(createOpenItemHandler));
    application.post(createItemEndpoint('/fs/refactor'), createItemAction(createRefactorItemHandler));
    application.put(createItemEndpoint('/fs'), createItemAction(createSaveItemHandler));

    watchFileStructure(fileStructure, sockets.of(createEndpoint('/watch-file-structure')));
}, 'application', 'sockets');

function createEndpointFactory (fileStructure: FileStructure): (prefix: string) => string {
    return function (prefix: string): string {
        return `${prefix}${fileStructure.url}`;
    };
}

function createItemEndpointFactory (endpointFactory: (prefix: string) => string): (prefix: string) => string {
    return function (prefix: string): string {
        return `${endpointFactory(prefix)}*`;
    };
}

function createItemActionFactory (fileStructure: FileStructure): (actionFactory: ActionFactory) => Action {
    return function (actionFactory: ActionFactory): Action {
        const action = actionFactory(fileStructure);
        return async function (request: Request, response: Response): Promise<void> {
            (request.params as Array<string>)[0] = `${fileStructure.url}${(request.params as Array<string>)[0]}`;
            return action(request, response);
        };
    };
}
