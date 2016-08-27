'use strict';

// Angular:
import { NgModule } from '@angular/core';

// Modules:
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module.ts';

// Dependencies:
import { FeaturesComponent } from './features.component';
import { FEATURES_ROUTING } from './features.routing';

@NgModule({
    declarations: [FeaturesComponent],
    imports: [
        CommonModule,
        FEATURES_ROUTING,
        FormsModule,
        SharedModule
    ],
})
export class FeaturesModule { }
