import { ElementRef } from '@angular/core';
import { ClickPreventDirective } from './click-prevent.directive';

describe('ClickPreventDirective', () => {
    it('should create an instance', () => {
        const element: ElementRef = new ElementRef(null);
        const directive = new ClickPreventDirective(null, element);
        expect(directive).toBeTruthy();
    });
});
