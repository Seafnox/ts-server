import { CategoryModel, ICategory } from '../../database/models/category';
import { Observable } from 'rxjs/internal/Observable';
import { fromPromise } from 'rxjs/internal-compatibility';
import { switchMap, take } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';

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

    public static removeCategory(id: string): Observable<ICategory> {
        return fromPromise(CategoryModel.findOneAndRemove({_id: id}).exec())
            .pipe(take(1));
    }
}
