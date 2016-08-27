'use strict';

// Angular:
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'tractor-select',
    templateUrl: 'select.component.html',
    styleUrls: ['select.component.scss']
})
export class SelectComponent {
    @Input() public display: string;
    @Input() public label: string;
    @Input() public model: string;
    @Input() public options: Array<string>;

    @Output() modelChange: EventEmitter<string> = new EventEmitter<string>();
}
