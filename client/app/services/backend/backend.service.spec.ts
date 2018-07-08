import { HttpClientModule } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';
import { jasmineDefaultTimeoutInterval } from '../../data/simple-constants.data';
import { BackendService } from './backend.service';

describe('BackendService', () => {
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
            imports: [HttpClientModule],
            providers: [
                BackendService,
            ],
        });
    });

    it('should be created', inject([BackendService], (service: BackendService) => {
        expect(service).toBeTruthy();
    }));
});
