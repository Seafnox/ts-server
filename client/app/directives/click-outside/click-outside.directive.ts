import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/skip';

@Directive({
    selector: '[appClickOutside]',
})
export class ClickOutsideDirective {
    @Output() public appClickOutside: EventEmitter<any> = new EventEmitter();

    constructor(private elementRef: ElementRef) {
    }

    @HostListener('document:click', ['$event', '$event.path'])
    public onClick(event: MouseEvent, targetElementPath: any[]): void {
        const elementRefInPath = targetElementPath.find(element => element === this.elementRef.nativeElement);
        if (!elementRefInPath) {
            this.appClickOutside.emit(event);
        }
    }
}
