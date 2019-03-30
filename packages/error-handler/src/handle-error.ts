// Dependencies:
import { error } from '@tractor/logger';
import { Response } from 'express';
import { TractorError } from './tractor-error';

// Constants:
import { SERVER_ERROR } from './constants';

export function handleError (response: Response, err: Error | TractorError, message?: string): void {
    error(message || err.message);
    response.status((err as TractorError).status || SERVER_ERROR);
    response.send(JSON.stringify({
        error: message || err.message
    }));
}
