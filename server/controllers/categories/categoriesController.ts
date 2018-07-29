import { IAppRequest } from '../../interfaces/AppRequest';
import { CategoriesHelper } from './CategoriesHelper';
import { ControllerHelper } from '../_helper/ControllerHelper';
import { Observable } from 'rxjs';
import { IAppAnswer } from '../../interfaces/ControllerAction';
import { map } from 'rxjs/operators';

export class CategoriesController {
    public static getAll(): Observable<IAppAnswer> {
        return CategoriesHelper.makeFindAll()
            .pipe(map((data) => ({data})));
    }

    public static get(req: IAppRequest): Observable<IAppAnswer> {
        return CategoriesHelper.makeFindById(req.params.id)
            .pipe(map((data) => ({data})));
    }

    public static post(req: IAppRequest): Observable<IAppAnswer> {
        const instanceData = ControllerHelper.Instance.loadSchema(req.body, CategoriesHelper.creationSchema);
        const userId = req.currentUser._id;

        return CategoriesHelper.makeCreate(userId, instanceData)
            .pipe(map((data) => ({data})));
    }

    public static put(req: IAppRequest): Observable<IAppAnswer> {
        const instanceData = ControllerHelper.Instance.loadSchema(req.body, CategoriesHelper.updationSchema);

        return CategoriesHelper.makeUpdate(req.params.id, instanceData)
            .pipe(map((data) => ({data})));
    }

    public static delete(req: IAppRequest): Observable<IAppAnswer> {
        return CategoriesHelper.makeDestroy(req.params.id)
            .pipe(map((data) => ({data})));
    }
}
