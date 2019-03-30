// Dependencies:
import { Tractor } from '@tractor/tractor';
import { Request, RequestHandler, Response } from 'express';

export function getConfigHandler (tractor: Tractor): RequestHandler {
    return function (_: Request, response: Response): void {
        response.send(tractor.config);
    };
}
