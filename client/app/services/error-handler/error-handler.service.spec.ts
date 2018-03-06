import { inject, TestBed } from '@angular/core/testing';
import { jasmineDefaultTimeoutInterval } from '../../data/simple-constants.data';

import { ErrorHandlerService } from './error-handler.service';

describe('ErrorHandlerService', () => {
    let originalTimeout;

    beforeEach(() => {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = jasmineDefaultTimeoutInterval;
    });

    afterEach(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ErrorHandlerService,
            ],
        });
    });

    it('should be created', inject([ErrorHandlerService], (service: ErrorHandlerService) => {
        expect(service).toBeTruthy();
    }));
});
