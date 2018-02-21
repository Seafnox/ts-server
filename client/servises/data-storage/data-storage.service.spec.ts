import { inject, TestBed } from '@angular/core/testing';
import { jasmineDefaultTimeoutInterval } from '../../config/simple-constants.data';

import { DataStorageService } from './data-storage.service';

describe('DataStorageService', () => {
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
                DataStorageService,
            ],
        });
    });

    it('should be created', inject([DataStorageService], (service: DataStorageService) => {
        expect(service).toBeTruthy();
    }));
});
