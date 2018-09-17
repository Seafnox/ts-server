import { CategoryModel, ICategory } from '../../database/models/category';
import { Observable } from 'rxjs/internal/Observable';
import { fromPromise } from 'rxjs/internal-compatibility';
import { switchMap, take } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { string, SchemaLike, forbidden } from 'joi';
import { ICategoryDto } from '../../../data/dto/category.dto';

export class CategoriesHelper {
    public static makeFindById(id: string): Observable<ICategory> {
        return fromPromise(CategoryModel.findById(id).exec())
            .pipe(take(1));
    }

    public static makeFindAll(): Observable<ICategory[]> {
        return fromPromise(CategoryModel.find({}).sort({title: 1}).exec())
            .pipe(take(1));
    }

    public static makeCreate(userId: string, categoryData: ICategoryDto): Observable<ICategory> {
        categoryData.userId = userId;

        return fromPromise(CategoryModel.create(categoryData))
            .pipe(take(1));
    }

    public static makeUpdate(id: string, categoryData: Partial<ICategoryDto>): Observable<ICategory> {
        return CategoriesHelper.makeFindById(id)
            .pipe(
                switchMap((category) => {
                    if (!category) {
                        return throwError(new Error(`No Category by id: ${id}`));
                    }

                    Object.keys(categoryData).forEach((key) =>
                        // @ts-ignore
                        category[key] = categoryData[key] || category[key]);

                    return fromPromise<ICategory>(category.save());
                }),
                take(1),
            );
    }

    public static makeDestroy(id: string): Observable<ICategory> {
        return fromPromise(CategoryModel.findOneAndRemove({_id: id}).exec())
            .pipe(take(1));
    }

    public static get creationSchema(): SchemaLike {
        return {
            id: string().allow(null),
            name: string().required(),
            title: string().required(),
            description: string().required(),
            userId: forbidden(),
        };
    }

    public static get updationSchema(): SchemaLike {
        return {
            id: forbidden(),
            name: string(),
            title: string(),
            description: string(),
            userId: forbidden(),
        };
    }
}
