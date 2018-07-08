import { Injectable } from '@angular/core';
import { AbstractIterableEndpointDataService } from '../abstract/iterable-endpoint-data/abstract-iterable-endpoint-data.service';
import { Observable } from 'rxjs';
import { BackendService } from '../backend/backend.service';

interface IItemDto {
    id: string;
    name: string;
}

interface IItem {
    id: string;
    title: string;
}

const url = '';

@Injectable()
export class ItemListService extends AbstractIterableEndpointDataService<IItemDto, IItem> {
    constructor(
        backendService: BackendService,
    ) {
        super(backendService, url);
    }

    protected mapRequestDtoItem(dto: IItemDto): IItem {
        return {
            id: dto.id,
            title: dto.name,
        };
    }

    protected onCatchError$(error: Error, repeatableObserver$: Observable<IItemDto[]>): Observable<IItemDto[]> {
        return undefined;
    }
}
