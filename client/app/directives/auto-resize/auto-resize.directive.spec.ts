import { AutoResizeDirective } from './auto-resize.directive';
import { ElementRef } from '@angular/core';

describe('AutoResizeDirective', () => {
    it('should create an instance', () => {
        const element = new ElementRef(null);

        const directive = new AutoResizeDirective(element, null);
        expect(directive).toBeTruthy();
    });
});
