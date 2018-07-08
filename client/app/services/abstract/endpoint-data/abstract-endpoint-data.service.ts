import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, filter, finalize, map, tap } from 'rxjs/operators';
import { BackendService } from '../../backend/backend.service';

export interface IParamConfig {
    [keys: string]: string;
}

export interface IQueryParamDict {
    params: IParamConfig;
}

/**
 * Абстрактный класс, который описывает сервис, получающий данные с бэка и хранящий их в своём сторе
 * Можно назвать это заглушкой ngRx.Store
 *
 * @template T, K
 */
export abstract class AbstractEndpointDataService<T, K> {
    /**
     * Хранилище загруженных с сервера данных
     *
     * @template K
     * @type {BehaviorSubject<K>}
     * @private
     */
    protected _data$ = new BehaviorSubject<K>(null);

    /**
     * Хранилище сообщений о состоянии 'Данне загружаются'
     * @type {BehaviorSubject<boolean>}
     * @private
     */
    protected _onLoading$ = new BehaviorSubject<boolean>(false);

    /**
     * Переменная отвечает за блокировку загрузки данных с бэка.
     * Пока её значение равно true - данные повторно загружаться не будут
     * @type {boolean}
     */
    protected loaded = false;

    protected constructor(
        public backendService: BackendService,
        private endpoint: string,
        private paramConfig?: IParamConfig,
    ) {}

    /**
     * Поток сообщений для внешних систем, который отдаёт релевантные данные, загруженные с сервера
     * @template K
     * @returns {Observable<K>}
     */
    public get data$(): Observable<K> {
        return this._data$.asObservable();
    }

    /**
     * Поток сообщений для внешних систем, который сообщает идёт ли сейчас загрузка данных с сервера
     * @returns {Observable<boolean>}
     */
    public get onLoading$(): Observable<boolean> {
        return this._onLoading$.asObservable();
    }

    /**
     * Метод запроса данных с сервера
     */
    public requestData(): void {
        if (!this.endpoint) {
            throw new Error(`${this.constructor.name}. Unexpected endpoint: '${this.endpoint}'`);
        }

        this._onLoading$.next(true);

        this.backendService.get$<T>(this.endpoint, this.getQueryParams(this.paramConfig))
            .pipe(
                catchError((error: Error, repeatableObserver$: Observable<T>) => this.onCatchError$(error, repeatableObserver$)),
                filter(() => !this.loaded),
                map((result: T) => this.mapRequestDto(result)),
                tap(() => this.loaded = true),
                finalize(() => this._onLoading$.next(false)),
            )
            .subscribe((data: K) => this._data$.next(data));
    }

    /**
     * Метод принудительного обновления данных. Запрашивает данные с сервера, даже если они уже были получены
     */
    public refreshDataFromServer(): void {
        this.loaded = false;
        this.requestData();
    }

    /**
     * Метод модификации внешних данных во внутрисистемные данные (Dto to Data)
     * @param {T} dto объект пришедший с сервера
     * @returns {K}
     */
    protected abstract mapRequestDto(dto: T): K;

    /**
     * Метод обработки ошибок сервера
     * @param {Error} error пришедшая ошибка
     * @param {Observable<T>} repeatableObserver$ поток, который необходимо вернуть, если нужно перезапустить запрос
     * @returns {Observable<T>} поток перезапуска или новый поток _throw
     */
    protected abstract onCatchError$(error: Error, repeatableObserver$: Observable<T>): Observable<T>;

    /**
     * Метод обрабатывает объект пар ключ-значение, поданый в конструктор, в параметры запроса к серверу
     * данные будут использоваться в каждом запросе к серверу.
     * Если параметры не заданы то функция вернёт undefined
     * @param {IParamConfig} paramConfig
     * @returns {IQueryParamDict}
     */
    protected getQueryParams(paramConfig: IParamConfig): IQueryParamDict {
        if (!paramConfig) {
            return {
                params: {},
            };
        }

        return {
            params: {
                ...paramConfig,
            },
        };
    }

}
