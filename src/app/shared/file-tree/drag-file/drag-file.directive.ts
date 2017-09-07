'use strict';

// Angular:
import { Directive, ElementRef, HostListener, Input, OnInit, Renderer } from '@angular/core';

// Dependencies:
import { FileStructureItem } from '../../file-structure/file-structure-item.interface';

// Constants:
const DRAG_CLASS = 'drag';

@Directive({
    selector: '[tractorDragFile]'
})
export class DragFileDirective implements OnInit {
    @Input() public file: FileStructureItem;

    constructor (
        private element: ElementRef,
        private renderer: Renderer
    ) { }

    public ngOnInit (): void {
        this.renderer.setElementProperty(this.element.nativeElement, 'draggable', true);
    }

    @HostListener('dragstart') public dragStart ($event?: DragEvent): void {
        $event.dataTransfer.effectAllowed = 'move';
        $event.dataTransfer.setData('file', JSON.stringify(this.file));
        this.renderer.setElementClass($event.target, DRAG_CLASS, true);
    }

    @HostListener('dragend') public dragEnd ($event?: DragEvent): void {
        this.renderer.setElementClass($event.target, DRAG_CLASS, false);
    }
}
