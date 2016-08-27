'use strict';

// Angular:
import { Injectable } from '@angular/core';

// Dependencies:
import { NotifierService } from '../../notifier/notifier.service';
import { RealTimeService } from '../real-time/real-time.service';

// Constants:
const PROTRACTOR_ERROR = 'protractor-err';
const PROTRACTOR_OUTPUT = 'protractor-out';
const RUN_PROTRACTOR_ROOM = 'run-protractor';

@Injectable()
export class RunnerService {
    private connection: SocketIOClient.Socket;

    constructor (
        private notifierService: NotifierService,
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
        this.notifierService[type](message);
    }
}
