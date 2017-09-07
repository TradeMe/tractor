'use strict';

// Angular:
import { RouterModule } from '@angular/router';

// Dependencies:
import { MockDataComponent } from './mock-data.component';

export const MOCK_DATA_ROUTING = RouterModule.forChild([{
    path: 'mock-data',
    component: MockDataComponent
}, {
    path: 'mock-data/:name',
    component: MockDataComponent
}]);
