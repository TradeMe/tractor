'use strict';

// Angular:
import { RouterModule } from '@angular/router';

// Dependencies:
import { FeaturesComponent } from './features.component';

export const FEATURES_ROUTING = RouterModule.forChild([{
    path: 'features',
    component: FeaturesComponent
}, {
    path: 'features/:name',
    component: FeaturesComponent
}]);
