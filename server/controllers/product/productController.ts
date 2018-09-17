import { Observable } from 'rxjs';
import { IAppAnswer } from '../../interfaces/ControllerAction';
import { ProductHelper } from './ProductHelper';
import { map, switchMap } from 'rxjs/operators';
import { IAppRequest } from '../../interfaces/AppRequest';
import { ControllerHelper } from '../_helper/ControllerHelper';
import { IProductData } from '../../database/models/product';

export class ProductController {
    public static getAll(): Observable<IAppAnswer> {
        return ProductHelper.makeFindAll()
            .pipe(map((data) => ({data})));
    }

    public static get(req: IAppRequest): Observable<IAppAnswer> {
        return ProductHelper.makeFindById(req.params.id)
            .pipe(map((data) => ({data})));
    }

    public static post(req: IAppRequest): Observable<IAppAnswer> {
        const instanceData: IProductData = ControllerHelper.Instance.validateDataBySchema(req.body, ProductHelper.creationSchema);
        const categoryId = req.params.categoryId;
        const userId = req.currentUser._id;

        return ProductHelper.makeCreate(categoryId, userId, instanceData)
            .pipe(map((data) => ({data})));
    }

    public static put(req: IAppRequest): Observable<IAppAnswer> {
        const instanceData: Partial<IProductData> = ControllerHelper.Instance.validateDataBySchema(req.body, ProductHelper.updationSchema);

        return ProductHelper.makeUpdate(req.params.id, instanceData)
            .pipe(map((data) => ({data})));
    }

    public static delete(req: IAppRequest): Observable<IAppAnswer> {
        return ProductHelper.makeDestroy(req.params.id)
            .pipe(map((data) => ({data})));
    }

    public static addInCategory(req: IAppRequest): Observable<IAppAnswer> {
        const params = ControllerHelper.Instance.validateDataBySchema(req.params, ProductHelper.addCategodyParamsSchema);
        return ProductHelper.makeFindById(params.id)
            .pipe(
                switchMap((product) => {
                    const categories: string[] = [
                        ...product.categories,
                        params.categoryId,
                    ];
                    return ProductHelper.makeUpdate(params.id, {categories});
                }),
                map((data) => ({data})),
            );
    }

    public static removeFromCategory(req: IAppRequest): Observable<IAppAnswer> {
        const params = ControllerHelper.Instance.validateDataBySchema(req.params, ProductHelper.removeCategodyParamsSchema);

        return ProductHelper.makeFindById(params.id)
            .pipe(
                switchMap((product) => {
                    const categories: string[] = product.categories.filter((categoryId) => categoryId !== params.categoryId);
                    return ProductHelper.makeUpdate(params.id, {categories});
                }),
                map((data) => ({data})),
            );
    }
}
