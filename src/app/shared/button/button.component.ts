'use strict';

// Angular:
import { Component, Input } from '@angular/core';

// Constants:
const BUTTON_ICON_CLASS = 'tractor-button__icon';

@Component({
    selector: 'tractor-button',
    templateUrl: 'button.component.html',
    styleUrls: ['button.component.scss']
})
export class ButtonComponent {
    @Input() public click: Function;
    @Input() public icon: string;
    @Input() public label: string;

    public get classes (): string {
        let classList: Array<string> = [];
        let hasIcon = !!this.icon;
        if (hasIcon) {
            classList.push(BUTTON_ICON_CLASS);
            classList.push(`${BUTTON_ICON_CLASS}--${this.icon}`);
        }
        return classList.join(' ');
    }
}
