import { IAppRequest } from '../../interfaces/AppRequest';
import { CategoriesHelper } from './CategoriesHelper';
import { ControllerHelper } from '../_helper/ControllerHelper';
import { Observable } from 'rxjs';
import { IAppAnswer } from '../../interfaces/ControllerAction';
import { map } from 'rxjs/operators';
import { ICategoryDto } from '../../../data/dto/category.dto';

export class CategoriesController {
    public static getAll(): Observable<IAppAnswer> {
        return CategoriesHelper.makeFindAll()
            .pipe(map((data) => ({data: data.map((item) => item.toObject())})));
    }

    public static get(req: IAppRequest): Observable<IAppAnswer> {
        return CategoriesHelper.makeFindById(req.params.id)
            .pipe(map((data) => ({data: data.toObject()})));
    }

    public static post(req: IAppRequest): Observable<IAppAnswer> {
        const instanceData: ICategoryDto =
            ControllerHelper.Instance.validateDataBySchema(req.body, CategoriesHelper.creationSchema);
        const userId = req.currentUser._id;

        return CategoriesHelper.makeCreate(userId, instanceData)
            .pipe(map((data) => ({data: data.toObject()})));
    }

    public static put(req: IAppRequest): Observable<IAppAnswer> {
        const instanceData: Partial<ICategoryDto> =
            ControllerHelper.Instance.validateDataBySchema(req.body, CategoriesHelper.updationSchema);

        return CategoriesHelper.makeUpdate(req.params.id, instanceData)
            .pipe(map((data) => ({data: data.toObject()})));
    }

    public static delete(req: IAppRequest): Observable<IAppAnswer> {
        return CategoriesHelper.makeDestroy(req.params.id)
            .pipe(map((data) => ({data: data.toObject()})));
    }
}
