'use strict';

// Angular:
import { NgModule } from '@angular/core';

// Modules:
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ConfigModule } from './config/config.module';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { HomeModule } from './home/home.module';
import { FeaturesModule } from './features/features/features.module';
import { MockDataModule  } from './features/mock-data/mock-data.module';
import { PageObjectsModule } from './features/page-objects/page-objects.module';
import { StepDefinitionsModule  } from './features/step-definitions/step-definitions.module';

// Dependencies:
import { APP_ROUTING } from './app.routing';
import { ControlPanelComponent } from './home/control-panel/control-panel.component';
import { NavComponent } from './home/nav/nav.component';
import { TractorAppComponent } from './home/tractor.component';

@NgModule({
    declarations: [ControlPanelComponent, NavComponent, TractorAppComponent],
    imports: [
        BrowserModule,
        // CommonModule,
        // ConfigModule,
        // FormsModule,
        // HttpModule,
        APP_ROUTING,

        HomeModule,
        // FeaturesModule,
        // MockDataModule,
        // PageObjectsModule,
        // StepDefinitionsModule
    ],
    bootstrap: [TractorAppComponent]
})
export class AppModule { }
