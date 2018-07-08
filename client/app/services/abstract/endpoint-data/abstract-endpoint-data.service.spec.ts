import { inject, TestBed } from '@angular/core/testing';
import { BackendService } from '../../backend/backend.service';
import { instance, mock } from 'ts-mockito';
import { Observable } from 'rxjs/Observable';
import { _throw } from 'rxjs/observable/throw';
import { AbstractEndpointDataService, ParamConfigInterface } from './abstract-endpoint-data.service';
import { Injectable } from '@angular/core';

// remove this class in your test
@Injectable()
class TestEndpointDataService extends AbstractEndpointDataService<string, string> {
    protected constructor(
        backendService: BackendService,
    ) {
        super(backendService, 'TestEndpointDataService');
    }

    protected mapRequestDto(dto: string): string {
        return dto;
    }

    protected onCatchError$(error: Error, repeatableObserver$: Observable<string>): Observable<string> {
        return _throw(error);
    }
}

// rename TestEndpointDataService to your service name
describe('TestEndpointDataService', () => {
    let backendService: BackendService;

    beforeEach(() => {
        backendService = mock<BackendService>(BackendService);
        TestBed.configureTestingModule({
            providers: [
                TestEndpointDataService,
                {provide: BackendService, useFactory: () => instance(backendService)},
            ],
        });
    });

    it('should be created', inject([TestEndpointDataService], (service: TestEndpointDataService) => {
        expect(service).toBeTruthy();
    }));
});
