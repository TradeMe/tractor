'use strict';

// Angular:
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'tractor-input',
    templateUrl: 'input.component.html',
    styleUrls: ['input.component.css']
})
export class InputComponent {
    @Input() public label: string;
    @Input() public model: string;
    @Input() public placeholder: string;

    @Output() modelChange: EventEmitter<string> = new EventEmitter<string>();

    public id: number = Math.floor(Math.random() * Date.now());
}
