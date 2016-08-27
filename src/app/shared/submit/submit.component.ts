'use strict';

// Angular:
import { Component, Input } from '@angular/core';

@Component({
    selector: 'tractor-submit',
    templateUrl: 'submit.component.html',
    styleUrls: ['../button/button.component.scss']
})
export class SubmitComponent {
    @Input() public label: string;
}
