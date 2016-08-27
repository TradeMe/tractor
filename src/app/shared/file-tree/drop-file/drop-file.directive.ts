'use strict';

// Angular:
import { Directive, ElementRef, HostListener, Input, Renderer } from '@angular/core';

// Dependencies:
import { Directory } from '../../file-structure/directory.interface';
import { FileStructureItem } from '../../file-structure/file-structure-item.interface';

// Constants:
const DRAGOVER_CLASS = 'dragover';

@Directive({
    selector: '[tractorDropFile]'
})
export class DropFileDirective {
    @Input() public directory: Directory;
    @Input() public onDrop: Function;

    constructor (
        private element: ElementRef,
        private renderer: Renderer
    ) { }

    @HostListener('dragover') public dragOver ($event?: DragEvent): void {
        $event.dataTransfer.dropEffect = 'move';
        $event.preventDefault();
        $event.stopPropagation();
        this.renderer.setElementClass(this.element.nativeElement, DRAGOVER_CLASS, true);
    }

    @HostListener('dragleave') public dragLeave ($event?: DragEvent): void {
        this.renderer.setElementClass(this.element.nativeElement, DRAGOVER_CLASS, false);
    }

    @HostListener('drop') public drop ($event?: DragEvent): void {
        $event.preventDefault();
        $event.stopPropagation();
        this.renderer.setElementClass(this.element.nativeElement, DRAGOVER_CLASS, false);
        let file: FileStructureItem = JSON.parse($event.dataTransfer.getData('file'));
        this.onDrop(file, this.directory);
    }
}
