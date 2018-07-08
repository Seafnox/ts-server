import { BackendService } from '../../backend/backend.service';
import { AbstractEndpointDataService, ParamConfigInterface } from '../endpoint-data/abstract-endpoint-data.service';

/**
 * Абстрактный класс, который описывает сервис, получающий данные с бэка в виде массива сущностей определённого типа
 * и хранящий их в своём сторе
 * Можно назвать это заглушкой ngRx.Store для массивов
 *
 * @template T, K
 */
export abstract class AbstractIterableEndpointDataService<T, K> extends AbstractEndpointDataService<T[], K[]> {
    protected constructor(
        backendService: BackendService,
        endpoint: string,
        paramConfig?: ParamConfigInterface,
    ) {
        super(backendService, endpoint, paramConfig);
    }

    /**
     * Метод-маппер, который обрабатывает полученный массив, преобразуя его из сущностей, соответствующих внешнему интерфейсу
     * в сущности, соответствующие внутреннему интерфейсу системы с помощью фунукции mapRequestDtoItem
     * @template T, K
     * @param {T[]} dto - массив сущностей, пришедший с сервера
     * @returns {K[]} - массив сущностей, который будет храниться в сервисе
     */
    protected mapRequestDto(dto: T[]): K[] {
        if (!Array.isArray(dto)) {
            console.warn(`${this.constructor.name}. Unexpected request dto type. Expected: ${typeof []}. Received: ${typeof dto}`);

            return [];
        }

        return dto.map(dtoItem => this.mapRequestDtoItem(dtoItem));
    }

    /**
     * Метод-маппер, который обрабатывает каждую сущность массива поотдельности, преобразуя её из типа T в тип K
     * @template T, K
     * @param {T} dto - сущность, пришедшая с сервера
     * @returns {K} - сущность, которая будет храниться в сервисе
     */
    protected abstract mapRequestDtoItem(dto: T): K;
}
