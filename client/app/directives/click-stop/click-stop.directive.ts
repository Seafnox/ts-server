import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';

/* tslint:disable:directive-selector no-output-rename */

@Directive({
    selector: '[click.stop]',
})
export class ClickStopDirective implements OnInit, OnDestroy {

    @Output('click.stop') stopEvent = new EventEmitter();
    private removeEventListener: () => void;

    constructor(private renderer: Renderer2, private element: ElementRef) {
    }

    ngOnInit(): void {
        this.removeEventListener = this.renderer.listen(this.element.nativeElement, 'click', event => {
            event.stopPropagation();
            this.stopEvent.emit(event);
        });
    }

    ngOnDestroy(): void {
        if (this && typeof this.removeEventListener === 'function') {
            this.removeEventListener();
        }
    }

}
