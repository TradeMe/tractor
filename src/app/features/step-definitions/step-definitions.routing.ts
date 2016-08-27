'use strict';

// Angular:
import { RouterModule } from '@angular/router';

// Dependencies:
import { StepDefinitionsComponent } from './step-definitions.component';

export const STEP_DEFINITIONS_ROUTING = RouterModule.forChild([{
    path: 'step-definitions',
    component: StepDefinitionsComponent
}, {
    path: 'step-definitions/:name',
    component: StepDefinitionsComponent
}]);
