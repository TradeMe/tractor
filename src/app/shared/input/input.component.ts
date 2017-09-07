'use strict';

// Angular:
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'tractor-input',
    templateUrl: 'input.component.html',
    styleUrls: ['input.component.scss']
})
export class InputComponent {
    @Input() public description: string;
    @Input() public label: string;
    @Input() public model: string;
    @Input() public placeholder: string;

    @Output() modelChange: EventEmitter<string> = new EventEmitter<string>();

    public id: number = Math.floor(Math.random() * Date.now());
}
