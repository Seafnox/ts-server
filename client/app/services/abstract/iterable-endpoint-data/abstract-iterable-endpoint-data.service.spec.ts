import { AbstractIterableEndpointDataService } from './abstract-iterable-endpoint-data.service';
import { inject, TestBed } from '@angular/core/testing';
import { BackendService } from '../../backend/backend.service';
import { instance, mock } from 'ts-mockito';
import { Observable } from 'rxjs/Observable';
import { _throw } from 'rxjs/observable/throw';
import { Injectable } from '@angular/core';

// remove this class in your test
@Injectable()
class TestIterableEndpointDataService extends AbstractIterableEndpointDataService<string, string> {
    protected constructor(
        backendService: BackendService,
    ) {
        super(backendService, 'TestIterableEndpointDataService');
    }

    protected mapRequestDtoItem(dto: string): string {
        return dto;
    }

    protected onCatchError$(error: Error, repeatableObserver$: Observable<string[]>): Observable<string[]> {
        return _throw(error);
    }
}

// rename TestIterableEndpointDataService to your service name
describe('TestIterableEndpointDataService', () => {
    let backendService: BackendService;

    beforeEach(() => {
        backendService = mock<BackendService>(BackendService);
        TestBed.configureTestingModule({
            providers: [
                TestIterableEndpointDataService,
                {provide: BackendService, useFactory: () => instance(backendService)},
            ],
        });
    });

    it('should be created', inject([TestIterableEndpointDataService], (service: TestIterableEndpointDataService) => {
        expect(service).toBeTruthy();
    }));
});
