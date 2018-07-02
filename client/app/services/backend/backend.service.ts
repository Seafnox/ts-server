import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/retryWhen';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { ErrorHandlerService } from '../error-handler/error-handler.service';
import { HttpRequestOptions } from './http-request-options.interface';

@Injectable()
export class BackendService {
    constructor(
        protected http: HttpClient,
        protected errorHandler: ErrorHandlerService,
    ) {}

    public get<T>(url: string, options?: HttpRequestOptions): Observable<T> {
        const source = this.http.get<T>(url, options);

        return this.requestHandler<T>(source);
    }

    public post<T>(url: string, options?: HttpRequestOptions): Observable<T> {
        const source = this.http.post<T>(url, options.body, options);

        return this.requestHandler<T>(source);
    }

    public patch<T>(url: string, options?: HttpRequestOptions): Observable<T> {
        const source = this.http.patch<T>(url, options.body, options);

        return this.requestHandler<T>(source);
    }

    public put<T>(url: string, options?: HttpRequestOptions): Observable<T> {
        const source = this.http.put<T>(url, options.body, options);

        return this.requestHandler<T>(source);
    }

    public delete<T>(url: string, options?: HttpRequestOptions): Observable<T> {
        const source = this.http.delete<T>(url, options);

        return this.requestHandler<T>(source);
    }

    public parseMessageErrors(errorString = ''): string[] {
        return errorString.split(/\n/);
    }

    private requestHandler<T>(source: Observable<T>, retryDelay = 1000): Observable<T> {
        return source
            .retryWhen((errors) => errors.delay(retryDelay).switchMap((_errors) => Observable.throw(_errors)))
            .catch((err: HttpErrorResponse) => {
                console.error(err);
                return this.errorHandler.handleError<T, typeof err>(err);
            });
    }
}
