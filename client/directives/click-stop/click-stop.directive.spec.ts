import { ClickStopDirective } from './click-stop.directive';
import { ElementRef } from '@angular/core';

describe('ClickStopDirective', () => {
    it('should create an instance', () => {
        const element = new ElementRef(null);

        const directive = new ClickStopDirective(null, element);
        expect(directive).toBeTruthy();
    });
});
