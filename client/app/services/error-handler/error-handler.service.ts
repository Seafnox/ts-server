import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';

@Injectable()
export class ErrorHandlerService {

    constructor() {
    }

    public handleError<T, K extends HttpErrorResponse>(errorResponse: K): Observable<T> {
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

        return Observable.throw(errMsg);
    }
}
