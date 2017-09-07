'use strict';

// Angular:
import { Headers, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/rx';

export function createJSONHeaders (): Headers {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return headers;
}

export function handleResponse<T> (response: Observable<Response>): Observable<T> {
    return response
    .map(handleData)
    .catch(handleError);
}

export function createSearchParams (keyValues: any): URLSearchParams {
    let params = new URLSearchParams();
    Object.keys(keyValues).forEach((key: string) => {
        let value = keyValues[key];
        if (value != null) {
            params.set(key, value);
        }
    });
    return params;
}

function handleData<T> (response: Response): T {
    if (response.status < 200 || response.status >= 300) {
        throw new Error(`Response status: ${response.status}`);
    }
    let body = response.json();
    return <T>(body || {});
}

function handleError (error: Error) {
    let { message } = error;
    console.error(message);
    return Observable.throw(message);
}
