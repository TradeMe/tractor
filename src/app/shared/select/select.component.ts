import { Component, Input, Output } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'tractor-select',
  templateUrl: 'select.component.html',
  styleUrls: ['select.component.css']
})
export class SelectComponent {
    @Input() public label: string;
    @Input() @Output() public model: string;
    @Input() public options: Array<string>;
}
