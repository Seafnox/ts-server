import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';

/* tslint:disable:directive-selector no-output-rename */

@Directive({
    selector: '[click.prevent]',
})
export class ClickPreventDirective implements OnInit, OnDestroy {
    @Output('click.prevent') preventDefaultEvent = new EventEmitter();
    private unsubscribe: Function;

    constructor(private renderer: Renderer2, private element: ElementRef) {
    }

    ngOnInit(): void {
        this.unsubscribe = this.renderer.listen(this.element.nativeElement, 'click', (event: MouseEvent) => {
            event.preventDefault();
            this.preventDefaultEvent.emit(event);
        });
    }

    ngOnDestroy(): void {
        if (this && typeof this.unsubscribe === 'function') {
            this.unsubscribe();
        }
    }
}
