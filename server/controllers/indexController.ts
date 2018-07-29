import pathHelper from '../helpers/pathHelper';
import { Observable, of } from 'rxjs';
import { IAppAnswer } from '../interfaces/ControllerAction';

export class IndexController {
    public static index(): Observable<IAppAnswer> {
        return of({
            fileUrl: pathHelper.getClientRelative('index.html'),
        });
    }
}
