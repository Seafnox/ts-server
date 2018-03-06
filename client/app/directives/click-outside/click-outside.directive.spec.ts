import { ElementRef } from '@angular/core';
import { ClickOutsideDirective } from './click-outside.directive';

describe('ClickOutsideDirective', () => {
    it('should create an instance', () => {
        const element: ElementRef = new ElementRef(null);
        const directive = new ClickOutsideDirective(element);
        expect(directive).toBeTruthy();
    });
});
