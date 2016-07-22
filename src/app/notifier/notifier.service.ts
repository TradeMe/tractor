'use strict';

// Angular:
import { Injectable } from '@angular/core';

// Dependencies:
import { Notification } from './notification';
import { NotificationType } from './notification-type.enum';

// Constants:
const DEFAULT_DISMISS_TIMEOUT = 10000;

@Injectable()
export class NotifierService {
    private notifications: Array<Notification> = [];

    public success (message: string) {
        this.addNotification(new Notification(message, NotificationType.Success));
    }

    public info (message: string) {
        this.addNotification(new Notification(message, NotificationType.Info));
    }

    public error (message: string) {
        this.addNotification(new Notification(message, NotificationType.Error));
    }

    public dismiss (toRemove: Notification) {
        this.notifications.splice(this.notifications.indexOf(toRemove), 1);
    }

    private addNotification (notification: Notification) {
        this.notifications.push(notification);
        setTimeout(() => {
            this.dismiss(notification);
        }, DEFAULT_DISMISS_TIMEOUT);
    }
}

export const NOTIFIER_SERVICE_PROVIDERS = [
    NotifierService
];
