import { IAppRequest } from './AppRequest';
import { IDictionary } from './dictionary';
import { Observable } from 'rxjs';

export interface IAppAnswer {
    status?: number;
    statusMessage?: string;
    data?: IDictionary;
    fileUrl?: string;
}

export type ControllerAction = (req: IAppRequest) => Observable<IAppAnswer>;
