'use strict';

// Angular:
import { RouterModule } from '@angular/router';

// Dependencies:
import { PageObjectsComponent } from './page-objects.component';

export const PAGE_OBJECTS_ROUTING = RouterModule.forChild([{
    path: 'page-objects',
    component: PageObjectsComponent
}, {
    path: 'page-objects/:name',
    component: PageObjectsComponent
}]);
