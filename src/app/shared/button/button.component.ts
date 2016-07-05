'use strict';

// Angular:
import { Component, Input } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'tractor-button',
    templateUrl: 'button.component.html',
    styleUrls: ['button.component.css']
})
export class ButtonComponent {
    @Input() public label: string;
    @Input() public click: Function;
}
