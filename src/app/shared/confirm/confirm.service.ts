'use strict';

// Angular:
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/rx';

@Injectable()
export class ConfirmService {
    show (): Subject<boolean> {
        return new Subject<boolean>();
    }
}

export const CONFIRM_PROVIDERS = [
    ConfirmService
];
