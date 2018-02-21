import { Directive, Input, ElementRef, HostListener, HostBinding, AfterContentChecked, AfterViewInit, Renderer2 } from '@angular/core';

@Directive({
    selector: '[appAutoResize]',
})
export class AutoResizeDirective implements AfterContentChecked, AfterViewInit {
    private element: HTMLElement;
    private maxHeight: number;

    @Input('appAutoResize') isResizable: boolean;
    @HostBinding('style.overflow') overflow: string;

    constructor(element: ElementRef, public renderer: Renderer2) {
        this.element = element.nativeElement;
    }

    @HostListener('input')
    onInput(): void {
        if (this.isResizable) {
            this.resize();
        }
    }

    ngAfterContentChecked(): void {
        if (this.isResizable) {
            this.resize();
        }
    }

    ngAfterViewInit(): void {
        const style = (<any>window).getComputedStyle(this.element);

        this.maxHeight = parseInt(style.getPropertyValue('max-height'), 10);
    }

    private setHeight(value: string): void {
        this.renderer.setStyle(this.element, 'height', value);
    }

    private resize(): void {
        this.setHeight('auto');

        if (this.maxHeight && this.element.scrollHeight > this.maxHeight) {
            this.overflow = 'auto';

            this.setHeight(`${this.maxHeight}px`);
        } else {
            this.setHeight(`${this.element.scrollHeight}px`);
        }
    }
}
