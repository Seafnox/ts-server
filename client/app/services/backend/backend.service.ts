import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpRequestOptions } from './http-request-options.interface';
import { catchError, delay, retryWhen, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';

@Injectable()
export class BackendService {
    constructor(
        protected http: HttpClient,
    ) {}

    public get$<T>(url: string, options?: HttpRequestOptions): Observable<T> {
        const source = this.http.get<T>(url, options);

        return this.requestHandler<T>(source);
    }

    public post$<T>(url: string, options?: HttpRequestOptions): Observable<T> {
        const source = this.http.post<T>(url, options.body, options);

        return this.requestHandler<T>(source);
    }

    public patch$<T>(url: string, options?: HttpRequestOptions): Observable<T> {
        const source = this.http.patch<T>(url, options.body, options);

        return this.requestHandler<T>(source);
    }

    public put$<T>(url: string, options?: HttpRequestOptions): Observable<T> {
        const source = this.http.put<T>(url, options.body, options);

        return this.requestHandler<T>(source);
    }

    public delete$<T>(url: string, options?: HttpRequestOptions): Observable<T> {
        const source = this.http.delete<T>(url, options);

        return this.requestHandler<T>(source);
    }

    protected requestHandler<T>(source: Observable<T>, retryDelay = 1000): Observable<T> {
        return source
            .pipe(
                retryWhen((errors) => errors.pipe(
                    delay(retryDelay),
                    switchMap((_errors) => throwError(_errors))),
                ),
                catchError((err: HttpErrorResponse) => this.handleError<T, typeof err>(err)),
            );
    }

    protected handleError<T, K extends HttpErrorResponse>(errorResponse: K): Observable<T> {
        const {status, statusText, error} = errorResponse;
        let errMsg: string;

        if (errorResponse instanceof HttpErrorResponse) {
            if (!error || !error.description) {
                errMsg = 'Unknown error!';
            } else {
                errMsg = error.description;
            }
        } else {
            // Ожидаем HttpErrorResponse, но прийти может всё что угодно. Это typescript, детка
            errMsg = error.description ? error.description : error.toString();
        }

        console.error(`${status}: ${statusText}| Error: ${errMsg}`);

        return throwError(errMsg);
    }

}
