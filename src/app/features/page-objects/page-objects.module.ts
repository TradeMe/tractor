'use strict';

// Angular:
import { NgModule } from '@angular/core';

// Modules:
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

// Dependencies:
import { PageObjectsComponent } from './page-objects.component';
import { PAGE_OBJECTS_ROUTING } from './page-objects.routing';

@NgModule({
    declarations: [PageObjectsComponent],
    imports: [
        CommonModule,
        FormsModule,
        PAGE_OBJECTS_ROUTING,
        SharedModule
    ],
})
export class PageObjectsModule { }
