'use strict';

// Angular:
import { Component } from '@angular/core';
import { Router, Routes, ROUTER_DIRECTIVES } from '@angular/router';

// Dependencies:
import { ControlPanelComponent } from './control-panel/control-panel.component';
import { NavComponent } from './nav/nav.component';

// Routes:
import { PageObjectsComponent } from './+page-objects/page-objects.component';
import { FeaturesComponent } from './+features/features.component';
import { StepDefinitionsComponent } from './+step-definitions/step-definitions.component';
import { MockDataComponent } from './+mock-data/mock-data.component';

@Component({
    moduleId: module.id,
    selector: 'tractor-app',
    templateUrl: 'tractor.component.html',
    styleUrls: ['tractor.component.css'],
    directives: [ControlPanelComponent, NavComponent, ROUTER_DIRECTIVES]
})
@Routes([
    { path: '/page-objects', component: PageObjectsComponent },
    { path: '/page-object/:name', component: PageObjectsComponent },
    { path: '/features', component: FeaturesComponent },
    { path: '/feature/:name', component: FeaturesComponent },
    { path: '/step-definitions', component: StepDefinitionsComponent },
    { path: '/step-definition/:name', component: StepDefinitionsComponent },
    { path: '/mocks', component: MockDataComponent },
    { path: '/mock/:name', component: MockDataComponent }
])
export class TractorAppComponent {
    constructor () { }
}
