'use strict';

// Angular:
import { Directive, ElementRef, Input, Renderer } from '@angular/core';

// Dependencies:
import { Directory } from '../../file-structure/directory.interface';
import { FileStructureItem } from '../../file-structure/file-structure-item.interface';

// Constants:
const DRAGOVER_CLASS = 'dragover';

@Directive({
    selector: '[tractorDropFile]',
    host: {
        '(dragover)': 'dragOver($event)',
        '(dragleave)': 'dragLeave($event)',
        '(drop)': 'drop($event)'
    }
})
export class DropFileDirective {
    @Input() public directory: Directory;
    @Input() public onDrop: Function;

    constructor (
        private element: ElementRef,
        private renderer: Renderer
    ) { }

    public dragOver ($event: DragEvent): void {
        $event.dataTransfer.dropEffect = 'move';
        $event.preventDefault();
        $event.stopPropagation();
        this.renderer.setElementClass(this.element.nativeElement, DRAGOVER_CLASS, true);
    }

    public dragLeave ($event: DragEvent): void {
        this.renderer.setElementClass(this.element.nativeElement, DRAGOVER_CLASS, false);
    }

    public drop ($event: DragEvent): void {
        $event.preventDefault();
        $event.stopPropagation();
        this.renderer.setElementClass(this.element.nativeElement, DRAGOVER_CLASS, false);
        let file: FileStructureItem = JSON.parse($event.dataTransfer.getData('file'));
        this.onDrop(file, this.directory);
    }
}
