'use strict';

// Angular:
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Subscription } from 'rxjs/rx';

// Dependencies:
import { ConfigService } from './config.service';
import { TractorConfig } from './config.interface';

@Injectable()
export class ConfigResolve implements Resolve<TractorConfig> {
    constructor (
        private configService: ConfigService
    ) {
        debugger;
    }

    resolve (): Subscription {
        debugger;
        return this.configService.getConfig();
    }
}
