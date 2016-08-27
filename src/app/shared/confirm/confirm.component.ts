'use strict';

// Angular:
import { Component, Input } from '@angular/core';
import { Observer } from 'rxjs/rx';

// Dependencies:
import { ButtonComponent } from '../button/button.component';

@Component({
    selector: 'tractor-confirm',
    templateUrl: 'confirm.component.html',
    styleUrls: ['confirm.component.scss'],
    directives: [ButtonComponent]
})
export class ConfirmComponent {
    @Input() public trigger: Observer<boolean>;

    public ok (): void {
        this.trigger.next(true);
        this.trigger.complete();
    }

    public cancel (): void {
        this.trigger.next(false);
        this.trigger.complete();
    }
}
