'use strict';

// Interfaces:
import { TractorConfig } from './app/shared/config/config.interface';

// Angular:
import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode, provide } from '@angular/core';
import { disableDeprecatedForms, provideForms } from '@angular/forms';
import { HTTP_PROVIDERS } from '@angular/http';

// Dependencies:
import { APP_ROUTER_PROVIDERS } from './app/tractor.routes';
import { ConfigService, TRACTOR_CONFIG } from './app/shared/config/config.service';
import { FILE_STRUCTURE_PROVIDERS } from './app/shared/file-structure/file-structure.service';
import { TractorAppComponent, environment } from './app/';

if (environment.production) {
    enableProdMode();
}

ConfigService.getConfig()
.subscribe(
    (config: TractorConfig) => {
        const TRACTOR_CONFIG_PROVIDER = provide(TRACTOR_CONFIG, { useValue: config });
        bootstrap(TractorAppComponent, [
            disableDeprecatedForms(),
            provideForms(),
            APP_ROUTER_PROVIDERS,
            HTTP_PROVIDERS,
            FILE_STRUCTURE_PROVIDERS,
            TRACTOR_CONFIG_PROVIDER
        ]);
    },
    (error: Error) => {
        console.error(error);
    }
);
