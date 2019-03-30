// Dependencies:
import { Tractor } from '@tractor/tractor';
import { Request, RequestHandler, Response } from 'express';

export function getPluginsHandler (tractor: Tractor): RequestHandler {
    return function (_: Request, response: Response): void {
        const pluginDescriptions = tractor.plugins.map(plugin => plugin.description);
        response.send(pluginDescriptions);
    };
}
