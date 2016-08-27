'use strict';

// Angular:
import { NgModule } from '@angular/core';

// Modules:
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module.ts';

// Dependencies:
import { MockDataComponent } from './mock-data.component';
import { MOCK_DATA_ROUTING } from './mock-data.routing';

@NgModule({
    declarations: [MockDataComponent],
    imports: [
        CommonModule,
        FormsModule,
        MOCK_DATA_ROUTING,
        SharedModule
    ],
})
export class MockDataModule { }
