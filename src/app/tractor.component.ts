'use strict';

// Angular:
import { Component } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router';

// Dependencies:
import { ControlPanelComponent } from './control-panel/control-panel.component';
import { NavComponent } from './nav/nav.component';
import { NotifierComponent } from './notifier/notifier.component';

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
    directives: [ControlPanelComponent, NavComponent, NotifierComponent, ROUTER_DIRECTIVES]
})
export class TractorAppComponent {
    constructor () { }
}
