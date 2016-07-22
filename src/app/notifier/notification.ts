'use strict';

// Dependencies:
import { NotificationType } from './notification-type.enum';

export class Notification {
    constructor (
        private message: string,
        private type: NotificationType
    ) { }
}
