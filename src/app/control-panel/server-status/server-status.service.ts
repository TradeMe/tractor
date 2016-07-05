'use strict';

// Angular:
import { Injectable } from '@angular/core';

// Dependencies:
// import NotifierService from '../../../Core/Components/Notifier/NotifierService';
import { RealTimeService } from '../../shared/real-time/real-time.service';

// Constants:
const DISCONNECT_MESSAGE: string = 'Tractor server disconnected...';
const SERVER_STATUS_ROOM: string = 'server-status';

@Injectable()
export class ServerStatusService {
    private _isServerRunning: boolean = false;

    public get isServerRunning () {
        return this._isServerRunning;
    }

    constructor (
        // notifierService,
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
        this._isServerRunning = true;
    }

    private onDisconnect (): void {
        this._isServerRunning = false;
        // this.notifierService.error(DISCONNECT_MESSAGE);
    }
}
