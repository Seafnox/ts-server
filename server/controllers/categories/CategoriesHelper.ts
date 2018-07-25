import { CategoryModel, ICategory } from '../../database/models/category';
import { Observable } from 'rxjs/internal/Observable';
import { fromPromise } from 'rxjs/internal-compatibility';
import { switchMap, take } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { string, SchemaLike } from 'joi';

export class CategoriesHelper {
    public static getCategoryById(id: string): Observable<ICategory> {
        return fromPromise(CategoryModel.findById(id).exec())
            .pipe(take(1));
    }

    public static getCategories(): Observable<ICategory[]> {
        return fromPromise(CategoryModel.find({}).sort({title: 1}).exec())
            .pipe(take(1));
    }

    public static addCategory(userId: string, categoryData: ICategory): Observable<ICategory> {
        categoryData.userId = userId;

        return fromPromise(CategoryModel.create(categoryData))
            .pipe(take(1));
    }

    public static updateCategory(categoryData: ICategory): Observable<ICategory> {
        return CategoriesHelper.getCategoryById(categoryData.id)
            .pipe(
                switchMap((category: ICategory) => {
                    if (!category) {
                        return throwError(new Error(`No Category by id: ${categoryData.id}`));
                    }

                    category.title = categoryData.title;
                    category.description = categoryData.description;

                    return fromPromise<ICategory>(category.save());
                }),
                take(1),
            );
    }

    public static destroyCategory(id: string): Observable<ICategory> {
        return fromPromise(CategoryModel.findOneAndRemove({_id: id}).exec())
            .pipe(take(1));
    }

    public static get createCategorySchema(): SchemaLike {
        return {
            id: string().allow(null),
            title: string().required(),
            description: string().required(),
        };
    }

    public static get updateCategorySchema(): SchemaLike {
        return {
            id: string().required(),
            title: string().required(),
            description: string().required(),
        };
    }

    public static get destroyCategorySchema(): SchemaLike {
        return {
            id: string().required(),
        };
    }
}
