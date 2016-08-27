'use strict';

// Angular:
import { NgModule } from '@angular/core';

// Modules:
import { SharedModule } from '../../shared/shared.module';

// Dependencies:
import { StepDefinitionsComponent } from './step-definitions.component';
import { STEP_DEFINITIONS_ROUTING } from './step-definitions.routing';

@NgModule({
    declarations: [StepDefinitionsComponent],
    imports: [
        SharedModule,
        STEP_DEFINITIONS_ROUTING
    ],
})
export class StepDefinitionsModule { }
