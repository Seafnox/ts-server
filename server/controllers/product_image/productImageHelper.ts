import { Observable, throwError } from 'rxjs';
import { IProductImage, IProductImageData, ProductImageModel } from '../../database/models/product_image';
import { fromPromise } from 'rxjs/internal-compatibility';
import { switchMap, take } from 'rxjs/operators';
import { forbidden, SchemaLike } from 'joi';

export class ProductImageHelper {
    public static findById(id: string): Observable<IProductImage> {
        return fromPromise(ProductImageModel.findById(id).exec())
            .pipe(take(1));
    }

    public static findAll(): Observable<IProductImage[]> {
        return fromPromise(ProductImageModel.find({}).exec())
            .pipe(take(1));
    }

    public static create(data: IProductImageData, userId: string): Observable<IProductImage> {
        data.userId = userId;

        return fromPromise(ProductImageModel.create(data))
            .pipe(take(1));
    }

    public static update(id: string, data: Partial<IProductImageData>): Observable<IProductImage> {
        return ProductImageHelper.findById(id)
            .pipe(
                switchMap((image) => {
                    if (!image) {
                        return throwError(new Error(`No Image by id: ${id}`));
                    }

                    Object.keys(data).forEach((key) =>
                        // @ts-ignore
                        image[key] = data[key] || image[key]);

                    return fromPromise(image.save());
                }),
                take(1),
            );
    }

    public static delete(id: string): Observable<IProductImage> {
        return fromPromise(ProductImageModel.findOneAndRemove({_id: id}).exec())
            .pipe(take(1));
    }

    public static creationScheme(): SchemaLike {
        return {
            id: forbidden(),

        }
    }
}
