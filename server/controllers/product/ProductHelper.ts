import { Observable } from 'rxjs';
import { IProduct, ProductModel } from '../../database/models/product';
import { fromPromise } from 'rxjs/internal-compatibility';
import { switchMap, take } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { array, forbidden, SchemaLike, string } from 'joi';

export class ProductHelper {
    public static makeFindById(id: string): Observable<IProduct> {
        return fromPromise(ProductModel.findById(id).exec())
            .pipe(take(1));
    }

    public static makeFindAll(): Observable<IProduct[]> {
        return fromPromise(ProductModel.find({}).sort({title: 1}).exec())
            .pipe(take(1));
    }

    public static makeCreate(categoryId: string, userId: string, productData: IProduct): Observable<IProduct> {
        productData.categories = categoryId ? [categoryId] : [];
        productData.userId = userId;

        return fromPromise(ProductModel.create(productData))
            .pipe(take(1));
    }

    public static makeUpdate(id: string, productData: Partial<IProduct>): Observable<IProduct> {
        return ProductHelper.makeFindById(id)
            .pipe(
                switchMap((product) => {
                    if (!product) {
                        return throwError(new Error(`No Category by id: ${productData.id}`));
                    }

                    Object.keys(productData).forEach((key) =>
                        // @ts-ignore
                        product[key] = productData[key] || product[key]);

                    return fromPromise<IProduct>(product.save());
                }),
                take(1),
            );
    }

    public static makeDestroy(id: string): Observable<IProduct> {
        return fromPromise(ProductModel.findOneAndRemove({_id: id}).exec())
            .pipe(take(1));
    }

    public static get creationSchema(): SchemaLike {
        return {
            id: forbidden(),
            name: string().required(),
            title: string().required(),
            categories: array().items(string()).allow(null),
            description: string().required(),
            images: forbidden(),
            userId: forbidden(),
        };
    }

    public static get updationSchema(): SchemaLike {
        return {
            id: forbidden(),
            name: string(),
            title: string(),
            description: string(),
            forbidden: forbidden(),
            images: forbidden(),
            userId: forbidden(),
        };
    }

    public static get addCategodyParamsSchema(): SchemaLike {
        return {
            id: string().required(),
            categoryId: string().required(),
        };
    }

    public static get removeCategodyParamsSchema(): SchemaLike {
        return {
            id: string().required(),
            categoryId: string().required(),
        };
    }
}
