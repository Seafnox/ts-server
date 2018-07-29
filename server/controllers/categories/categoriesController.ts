import { IAppRequest } from '../../interfaces/AppRequest';
import { CategoriesHelper } from './CategoriesHelper';
import { ControllerHelper } from '../_helper/ControllerHelper';
import { Observable } from 'rxjs';
import { IAppAnswer } from '../../interfaces/ControllerAction';
import { map } from 'rxjs/operators';

export class CategoriesController {
    public static getList(req: IAppRequest): Observable<IAppAnswer> {
        return CategoriesHelper.getCategories()
            .pipe(map((categories) => ({
                data: categories,
            })));
    }

    public static get(req: IAppRequest): Observable<IAppAnswer> {
        return CategoriesHelper.getCategoryById(req.params.id)
            .pipe(map((category) => ({
                data: category,
            })));
    }

    public static post(req: IAppRequest): Observable<IAppAnswer> {
        const data = ControllerHelper.Instance.loadSchema(req.body, CategoriesHelper.createCategorySchema);
        const userId = req.currentUser._id;

        return CategoriesHelper.addCategory(userId, data)
            .pipe(map((category) => ({
                data: category,
            })));
    }

    public static put(req: IAppRequest): Observable<IAppAnswer> {
        const data = ControllerHelper.Instance.loadSchema(req.body, CategoriesHelper.updateCategorySchema);

        return CategoriesHelper.updateCategory(data)
            .pipe(map((category) => ({
                data: category,
            })));
    }

    public static delete(req: IAppRequest): Observable<IAppAnswer> {
        const data = ControllerHelper.Instance.loadSchema(req.body, CategoriesHelper.destroyCategorySchema);

        return CategoriesHelper.destroyCategory(data.id)
            .pipe(map((category) => ({
                data: category,
            })));
    }
}
