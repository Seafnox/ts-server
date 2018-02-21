import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subscription } from 'rxjs/Subscription';
import { AUTH_CONFIG } from '../../config/auth.config';
import { ContentTypes } from '../../config/content-type.constants';
import { UrlParams } from '../../config/url-params.config';
import { LocalStorage } from '../../decorators/localstorage.decorator';
import { AuthModel } from '../../models/auth.model';
import { BackendService } from '../backend/backend.service';
import { DataStorageService } from '../data-storage/data-storage.service';
import { ErrorHandlerService } from '../error-handler/error-handler.service';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class AuthService extends BackendService {
    @LocalStorage() public rememberMe: boolean;
    @LocalStorage() private _tokenExpirationDate;
    public isTokenRefreshed: ReplaySubject<any> = new ReplaySubject();
    private refreshTimeout: Subscription;

    constructor(protected http: HttpClient,
                protected store: DataStorageService,
                protected errorHandler: ErrorHandlerService,
                protected notificationService: NotificationService) {
        super(http, store, errorHandler, notificationService);
    }

    get tokenExpirationDate(): number {
        return this._tokenExpirationDate;
    }

    set tokenExpirationDate(time: number) {
        this._tokenExpirationDate = moment().add(time, 's').valueOf();
    }

    public isRefreshTimeoutSet(): boolean {
        return this.refreshTimeout && !this.refreshTimeout.closed;
    }

    public isUserAuthorized(): boolean {
        const {authData} = this.store;

        return authData && Object.keys(authData).every(key => !!authData[key]);
    }

    public setTokenRefresh(): void {
        const timeout: number = this.checkTime(this._tokenExpirationDate);
        this.startTimeout(timeout);
    }

    public fetchToken(login: { username: string, password: string }): Observable<any> {
        const data = Object.assign({}, login, {grant_type: 'password'});
        const source = this.post(UrlParams.TOKEN, {body: data}, ContentTypes.FORM_TYPE);

        return this.configureToken(source);
    }

    public refreshToken(): void {
        const {refresh_token} = this.store.authData;
        const data = Object.assign({}, {grant_type: 'refresh_token', refresh_token});
        const source = this.post(UrlParams.TOKEN, {body: data}, ContentTypes.FORM_TYPE);

        this.configureToken(source).subscribe(() => this.isTokenRefreshed.next(true));
    }

    private configureToken(source: Observable<any>): Observable<any> {
        return source
            .map(authData => this.store.authData = new AuthModel(authData))
            .do(({expires_in}: AuthModel) => this.tokenExpirationDate = expires_in)
            .do(() => this.setTokenRefresh());
    }

    public checkTime(tokenTime: number): number {
        const currentDate = moment();
        const tokenDate = moment(tokenTime);

        return tokenDate.diff(currentDate);
    }

    public logout(): boolean {
        if (this.refreshTimeout) {
            this.refreshTimeout.unsubscribe();
        }
        this.store.authData = null;

        return this.isUserAuthorized();
    }

    private startTimeout(timeoutTime: number): void {
        this.refreshTimeout = Observable.timer(timeoutTime)
            .subscribe(() => this.refreshToken());
    }

    protected addToken(headers: HttpHeaders): HttpHeaders {
        return headers.set('Authorization', this.getToken());
    }

    private getToken(): string {
        return `Basic ${btoa(`${AUTH_CONFIG.CLIENT_ID}:${AUTH_CONFIG.CLIENT_SECRET}`)}`;
    }
}
