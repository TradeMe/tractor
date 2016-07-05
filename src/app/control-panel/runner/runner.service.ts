'use strict';

// Angular:
import { Injectable } from '@angular/core';

// Dependencies:
// import NotifierService from '../../../Core/Components/Notifier/NotifierService';
import { RealTimeService } from '../../shared/real-time/real-time.service';

// Constants:
const PROTRACTOR_ERROR: string = 'protractor-err';
const PROTRACTOR_OUTPUT: string = 'protractor-out';
const RUN_PROTRACTOR_ROOM: string = 'run-protractor';

@Injectable()
export class RunnerService {
    private connection: SocketIOClient.Socket;

    constructor (
        // notifierService,
        private realTimeService: RealTimeService
    ) {
        this.addRealTimeEvents();
    }

    public runProtractor (options): void {
        this.connection.emit('run', options);
    }

    private addRealTimeEvents (): void {
        this.connection = this.realTimeService.connect(RUN_PROTRACTOR_ROOM, {
            [PROTRACTOR_ERROR]: (event) => this.notify(event),
            [PROTRACTOR_OUTPUT]: (event) => this.notify(event)
        });
    }

    private notify (data): void {
        let { type, message } = data;
        // this.notifierService[type](message);
    }
}
