'use strict';

// Angular:
import { NgModule } from '@angular/core';

// Dependencies:
import { ConfigResolve } from './config.resolve';
import { ConfigService } from './config.service';

@NgModule({
    providers: [ConfigResolve, ConfigService]
})
export class ConfigModule { }
