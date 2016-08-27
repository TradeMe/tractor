'use strict';

// Angular:
import { Directive, ElementRef, OnInit, Renderer } from '@angular/core';

@Directive({
    selector: '[tractorFocusOn]'
})
export class FocusOnDirective implements OnInit {
    constructor (
        private element: ElementRef,
        private renderer: Renderer
    ) { }

    public ngOnInit () {
        this.renderer.invokeElementMethod(this.element.nativeElement, 'focus', null);
    }
}
