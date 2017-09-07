'use strict';

// Angular:
import { Component, OnInit } from '@angular/core';

// Dependencies:
import { ConfigService } from '../../config/config.service';
import { RunnerService } from './runner/runner.service';
import { ServerStatusService } from './server-status/server-status.service';

@Component({
    selector: 'tractor-control-panel',
    templateUrl: 'control-panel.component.html',
    styleUrls: ['control-panel.component.scss']
})
export class ControlPanelComponent implements OnInit {
    public environment: string;

    public get environments (): Array<string> {
        return this.config.environments;
    }

    public get isServerRunning (): boolean {
        return this.serverStatusService.isServerRunning;
    }

    public get serverStatus (): string {
        let status = 'Tractor server is';
        if (this.isServerRunning) {
            return `${status} running.`;
        } else {
            return `${status} not running.`;
        }
    }

    constructor (
        private config: ConfigService,
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
