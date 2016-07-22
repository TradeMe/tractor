'use strict';

// Angular:
import { OpaqueToken, provide, ReflectiveInjector } from '@angular/core';
import { Http, HTTP_PROVIDERS, Request, XSRFStrategy } from '@angular/http';
import { Observable } from 'rxjs/rx';

// Utilities:
import { handleResponse } from '../utilities/http-utilities';

// Dependencies:
import { TractorConfig } from './config.interface';

// Constants:
const CONFIG_URL = 'http://localhost:4000/config';

class FakeXSRFStrategy implements XSRFStrategy {
    public configureRequest(req: Request) { /* */ }
}

const XRSF_MOCK = provide(XSRFStrategy, { useValue: new FakeXSRFStrategy() })

export class ConfigService implements TractorConfig {
    static getConfig (): Observable<TractorConfig> {
        let injector = ReflectiveInjector.resolveAndCreate([
            HTTP_PROVIDERS,
            XRSF_MOCK
        ]);

        let http: Http = injector.get(Http);
        return handleResponse(http.get(CONFIG_URL));
    }
}

const TRACTOR_CONFIG_TOKEN = 'TRACTOR_CONFIG';
export const TRACTOR_CONFIG = new OpaqueToken(TRACTOR_CONFIG_TOKEN);
