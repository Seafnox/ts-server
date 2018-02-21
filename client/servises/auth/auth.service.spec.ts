import { HttpClientModule } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';
import { jasmineDefaultTimeoutInterval } from '../../config/simple-constants.data';
import { BackendService } from '../backend/backend.service';
import { DataStorageService } from '../data-storage/data-storage.service';
import { ErrorHandlerService } from '../error-handler/error-handler.service';
import { NotificationService } from '../notification/notification.service';
import { AuthService } from './auth.service';
import { instance, mock } from 'ts-mockito';

describe('AuthService', () => {
    let backendService: BackendService;
    let errorHandlerService: ErrorHandlerService;
    let dataStorageService: DataStorageService;
    let notificationService: NotificationService;
    let originalTimeout;

    beforeEach(() => {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = jasmineDefaultTimeoutInterval;
    });

    afterEach(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    beforeEach(() => {
        backendService = mock<BackendService>(BackendService);
        errorHandlerService = mock<ErrorHandlerService>(ErrorHandlerService);
        dataStorageService = mock<DataStorageService>(DataStorageService);
        notificationService = mock<NotificationService>(NotificationService);

        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [
                AuthService,
                {provide: BackendService, useFactory: () => instance(backendService)},
                {provide: ErrorHandlerService, useFactory: () => instance(errorHandlerService)},
                {provide: DataStorageService, useFactory: () => instance(dataStorageService)},
                {provide: NotificationService, useFactory: () => instance(notificationService)},
            ],
        });
    });

    it('should be created', inject([AuthService], (service: AuthService) => {
        expect(service).toBeTruthy();
    }));
});
