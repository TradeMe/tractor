'use strict';

// Interfaces:
import { TractorConfig } from '../shared/config/config.interface';

// Angular:
import { Component, Inject, OnInit } from '@angular/core';

// Dependencies:
import { ButtonComponent } from '../shared/button/button.component';
import { ConfigService, TRACTOR_CONFIG } from '../shared/config/config.service';
import { RealTimeService } from '../shared/real-time/real-time.service';
import { RunnerService } from './runner/runner.service';
import { SelectComponent } from '../shared/select/select.component';
import { ServerStatusService } from './server-status/server-status.service';

@Component({
    moduleId: module.id,
    selector: 'tractor-control-panel',
    templateUrl: 'control-panel.component.html',
    styleUrls: ['control-panel.component.css'],
    directives: [ButtonComponent, SelectComponent],
    providers: [RealTimeService, RunnerService, ServerStatusService]
})
export class ControlPanelComponent implements OnInit {
    private environment: string;

    public get environments (): Array<string> {
        return this.config.environments;
    }

    public get isServerRunning (): boolean {
        return this.serverStatusService.isServerRunning;
    }

    public get serverStatus (): string {
        let status: string = 'Tractor server is';
        if (this.isServerRunning) {
            return `${status} running.`;
        } else {
            return `${status} not running.`
        }
    }

    constructor (
        @Inject(TRACTOR_CONFIG) private config: TractorConfig,
        private runnerService: RunnerService,
        private serverStatusService: ServerStatusService
    ) { }

    public ngOnInit () {
        [this.environment] = this.environments;
    }

    public runProtractor (): void {
        this.runnerService.runProtractor({
            baseUrl: this.environment
        });
    }
}
