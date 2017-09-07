'use strict';

// Angular:
import { NgModule } from '@angular/core';

// Modules:
import { CommonModule } from '@angular/common';
import { ConfigModule } from '../config/config.module';
import { SharedModule } from '../shared/shared.module';

// Dependencies:
import { ControlPanelComponent } from './control-panel/control-panel.component';
import { NotifierComponent } from './notifier/notifier.component';
import { RealTimeService } from './control-panel/real-time/real-time.service';
import { RunnerService } from './control-panel/runner/runner.service';
import { ServerStatusService } from './control-panel/server-status/server-status.service';

@NgModule({
    declarations: [
        NotifierComponent
    ],
    exports: [],
    imports: [CommonModule, ConfigModule, SharedModule],
    providers: [RealTimeService, RunnerService, ServerStatusService]
})
export class HomeModule { }
