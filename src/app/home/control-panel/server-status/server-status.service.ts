'use strict';

// Angular:
import { Injectable } from '@angular/core';

// Dependencies:
import { NotifierService } from '../../notifier/notifier.service';
import { RealTimeService } from '../real-time/real-time.service';

// Constants:
const DISCONNECT_MESSAGE = 'Tractor server disconnected...';
const SERVER_STATUS_ROOM = 'server-status';

@Injectable()
export class ServerStatusService {
    private _isServerRunning: boolean = false;
    public get isServerRunning () {
        return this._isServerRunning;
    }

    private needsReload: boolean = false;

    constructor (
        private notifierService: NotifierService,
        private realTimeService: RealTimeService
    ) {
        this.addRealTimeEvents();
    }

    private addRealTimeEvents (): void {
        this.realTimeService.connect(SERVER_STATUS_ROOM, {
            connect: () => this.onConnect(),
            disconnect: () => this.onDisconnect()
        });
    }

    private onConnect (): void {
        if (this.needsReload) {
            location.reload();
        }
        this._isServerRunning = true;
        this.needsReload = false;
    }

    private onDisconnect (): void {
        this._isServerRunning = false;
        this.needsReload = true;
        this.notifierService.error(DISCONNECT_MESSAGE);
    }
}
