'use strict';

// Angular:
import { provideRouter, RouterConfig } from '@angular/router';

// Routes:
import { PageObjectsComponent } from './+page-objects/page-objects.component';
import { FeaturesComponent } from './+features/features.component';
import { StepDefinitionsComponent } from './+step-definitions/step-definitions.component';
import { MockDataComponent } from './+mock-data/mock-data.component';

const routes: RouterConfig = [
    {
        path: '',
        redirectTo: '/page-objects',
        pathMatch: 'full'
    },
    {
        path: 'page-objects',
        component: PageObjectsComponent
    },
    {
        path: 'page-objects/:name',
        component: PageObjectsComponent
    },
    {
        path: 'features',
        component: FeaturesComponent
    },
    {
        path: 'features/:name',
        component: FeaturesComponent
    },
    {
        path: 'step-definitions',
        component: StepDefinitionsComponent
    },
    {
        path: 'step-definitions/:name',
        component: StepDefinitionsComponent
    },
    {
        path: 'mocks',
        component: MockDataComponent
    },
    {
        path: 'mocks/:name',
        component: MockDataComponent
    }
];

export const APP_ROUTER_PROVIDERS = [
    provideRouter(routes)
];
