import { Injectable } from '@angular/core';
import { AbstractIterableEndpointDataService } from '../abstract/iterable-endpoint-data/abstract-iterable-endpoint-data.service';
import { BackendService } from '../backend/backend.service';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

interface ICategoryDto {
    id: string;
    name: string;
    imageUrl: string;
}

interface ICategory {
    id: string;
    name: string;
    imageUrl: string;
}

const url = '';

@Injectable()
export class CategoryListService extends AbstractIterableEndpointDataService<ICategoryDto, ICategory> {

  constructor(backendService: BackendService) {
      super(backendService, url);
  }

    protected mapRequestDtoItem(dto: ICategoryDto): ICategory {
        return undefined;
    }

    protected onCatchError$(error: Error, repeatableObserver$: Observable<ICategoryDto[]>): Observable<ICategoryDto[]> {
        return of([]);
    }

}
