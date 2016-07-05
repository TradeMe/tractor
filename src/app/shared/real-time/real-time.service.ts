'use strict';

// Interfaces:
import { TractorConfig } from '../config/config.interface';

// Angular:
import { Inject, Injectable } from '@angular/core';

// Dependencies:
import * as io from 'socket.io-client';
import { TRACTOR_CONFIG } from '../config/config.service';

@Injectable()
export class RealTimeService {
    constructor (
        @Inject(TRACTOR_CONFIG) private config: TractorConfig
    ) { }

    connect (room: string, events): SocketIOClient.Socket {
        let url = `http://localhost:${this.config.port}/${room}`;
        let connection: SocketIOClient.Socket = io.connect(url, {
            forceNew: true
        });
        // Object.entries(events).forEach(entry => {
        //     let [event, handler] = entry;
        //     connection.on(event, handler);
        // });
        return connection;
    }
}

export const REAL_TIME_PROVIDERS = [
    RealTimeService
];
