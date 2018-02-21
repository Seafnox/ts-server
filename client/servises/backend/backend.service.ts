import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/retryWhen';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { ContentTypes } from '../../config/content-type.constants';
import { DataStorageService } from '../data-storage/data-storage.service';
import { ErrorHandlerService } from '../error-handler/error-handler.service';
import { NOTIFICATION_TYPES } from '../notification/notification.config';
import { NotificationService } from '../notification/notification.service';
import { ErrorResponseInterface } from './error.response.interface';
import { HttpRequestOptions } from './http-request-options.interface';

const errorWaitingTimeout = 1000;

// tslint:disable:no-invalid-this
export function SetHeaders<T>(targetClass: any, methodName: string, descriptor: TypedPropertyDescriptor<any>): any {
    return {
        value(url: string, options?: HttpRequestOptions, contentType?: string): T {
            if (!options) {
                options = {};
            }
            let headers = new HttpHeaders();
            let params = new HttpParams();
            let body = options.body;

            if (options.params) {
                Object.keys(options.params)
                    .filter((key: string) => options.params[key])
                    .forEach((key: string) => params = params.append(key, options.params[key]));
            }

            // prepare body and headers if it's necessary
            if (contentType) {
                const type: string = contentType.toUpperCase();
                headers = headers.set('Content-Type', ContentTypes[type]);

                switch (contentType) {
                    case ContentTypes.FORM_TYPE:
                        body = Object.toURI(body);
                        break;
                    case ContentTypes.JSON_TYPE:
                        body = JSON.stringify(body);
                        break;
                    case ContentTypes.TEXT_TYPE:
                        body = body.toString();
                        break;
                    default:
                        console.error(`BackendService@SetHeaders: Unexpected content type: ${contentType}`);
                }
            }

            options = Object.assign(options, {body, params, headers});

            return descriptor.value.call(this, url, options, contentType);
        },
    };
}
// tslint:enable:no-invalid-this

@Injectable()
export class BackendService {
    constructor(protected http: HttpClient,
                protected store: DataStorageService,
                protected errorHandler: ErrorHandlerService,
                protected notificationService: NotificationService) {
    }

    @SetHeaders
    public get<T>(url: string, options?: HttpRequestOptions): Observable<T> {
        options.headers = this.addToken(options.headers);

        const source = this.http.get<T>(url, options)
            // TODO временно хэндлим баг на бэкэнде
            .retryWhen(errors => errors.delay(errorWaitingTimeout).switchMap(_errors => Observable.throw(_errors)))
            .retry(1);

        return this.requestHandler<T>(source);
    }

    @SetHeaders
    public post<T>(url: string, options?: HttpRequestOptions, contentType: string = ContentTypes.JSON_TYPE): Observable<T> {
        options.headers = this.addToken(options.headers);

        const source = this.http.post<T>(url, options.body, options)
            // TODO временно хэндлим баг на бэкэнде
            .retryWhen(errors => errors.delay(errorWaitingTimeout).switchMap(_errors => Observable.throw(_errors)))
            .retry(1);

        return this.requestHandler<T>(source);
    }

    @SetHeaders
    public patch<T>(url: string, options?: HttpRequestOptions, contentType: string = ContentTypes.JSON_TYPE): Observable<T> {
        options.headers = this.addToken(options.headers);

        const source = this.http.patch<T>(url, options.body, options);

        return this.requestHandler<T>(source);
    }

    @SetHeaders
    public put<T>(url: string, options?: HttpRequestOptions, contentType: string = ContentTypes.JSON_TYPE): Observable<T> {
        options.headers = this.addToken(options.headers);

        const source = this.http.put<T>(url, options.body, options);

        return this.requestHandler<T>(source);
    }

    @SetHeaders
    public delete<T>(url: string, options?: HttpRequestOptions): Observable<T> {
        options.headers = this.addToken(options.headers);

        const source = this.http.delete<T>(url, options);

        return this.requestHandler<T>(source);
    }

    protected addToken(headers: HttpHeaders): HttpHeaders {
        return headers.set('Authorization', this.store.token);
    }

    public parseMessageErrors(errorString = ''): string[] {
        return errorString.split(/\n/);
    }

    private requestHandler<T>(source: Observable<T>, retryDelay = 1000): Observable<T> {
        return source
            .retryWhen(errors => errors.delay(retryDelay).switchMap(_errors => Observable.throw(_errors)))
            .catch((err: HttpErrorResponse) => {
                const backendError: ErrorResponseInterface = err.error;
                const messageErrors = this.parseMessageErrors(backendError.description);
                messageErrors.forEach((messageError: string) => {
                    this.notificationService.addNotification(backendError.message, messageError, NOTIFICATION_TYPES.ERROR);
                });

                return this.errorHandler.handleError<T, typeof err>(err);
            });
    }
}
