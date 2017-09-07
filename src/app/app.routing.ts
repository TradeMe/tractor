'use strict';

// Angular:
import { Routes, RouterModule } from '@angular/router';

// Dependencies:
import { ConfigResolve } from './config/config.resolve';

export const routes: Routes = [{
    path: '',
    redirectTo: 'page-objects',
    pathMatch: 'full',
    resolve: {
        config: ConfigResolve
    }
}];

export const APP_ROUTING = RouterModule.forRoot(routes);
