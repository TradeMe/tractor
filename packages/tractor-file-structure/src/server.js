// Dependencies:
import express from 'express';

// Actions:
import { createDeleteItemHandler } from './actions/delete-item';
import { createMoveItemHandler } from './actions/move-item';
import { createOpenItemHandler } from './actions/open-item';
import { createRefactorItemHandler } from './actions/refactor-item';
import { createSaveItemHandler } from './actions/save-item';
import { watchFileStructure } from './actions/watch-file-structure';

export function serveFileStructure (application, sockets) {
    return function (fileStructure) {
        let createEndpoint = endpointFactory(fileStructure);
        let createItemEndpoint = itemEndpointFactory(createEndpoint);
        let createItemHandler = itemHandlerFactory(fileStructure);

        application.use(createEndpoint('/fs/static'), express.static(fileStructure.path));

        application.delete(createItemEndpoint('/fs'), createItemHandler(createDeleteItemHandler));
        application.post(createItemEndpoint('/fs/move'), createItemHandler(createMoveItemHandler));
        application.get(createItemEndpoint('/fs'), createItemHandler(createOpenItemHandler));
        application.post(createItemEndpoint('/fs/refactor'), createItemHandler(createRefactorItemHandler));
        application.put(createItemEndpoint('/fs'), createItemHandler(createSaveItemHandler));

        watchFileStructure(fileStructure, sockets.of(createEndpoint('watch-file-structure')));
    };
}
serveFileStructure['@Inject'] = ['application', 'sockets'];

function endpointFactory (fileStructure) {
    return function (prefix) {
        return `${prefix}${fileStructure.url}`;
    };
}

function itemEndpointFactory (endpointFactory) {
    return function (prefix) {
        return `${endpointFactory(prefix)}*`;
    };
}

function itemHandlerFactory (fileStructure) {
    return function (handlerFactory) {
        let handler = handlerFactory(fileStructure);
        return function (request, ...args) {
            request.params[0] = `${fileStructure.url}${request.params[0]}`;
            return handler(request, ...args);
        };
    };
}
