'use strict';

// Angular:
import { Injectable } from '@angular/core';

// Dependencies:
import * as io from 'socket.io-client';
import { ConfigService } from '../../../config/config.service';

@Injectable()
export class RealTimeService {
    constructor (
        private config: ConfigService
    ) { }

    connect (room: string, events): SocketIOClient.Socket {
        let url = `http://localhost:${this.config.port}/${room}`;
        let connection: SocketIOClient.Socket = io.connect(url, {
            forceNew: true
        });
        Object.keys(events).forEach((event: string) => {
            let handler = events[event];
            connection.on(event, handler);
        });
        return connection;
    }
}
