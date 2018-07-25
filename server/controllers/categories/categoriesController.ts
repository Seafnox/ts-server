import { IApplicationRequest } from '../../interfaces/ApplicationRequest';
import { Response } from 'express';
import { CategoriesHelper } from './CategoriesHelper';
import { ICategory } from '../../database/models/category';
import { ControllerHelper } from '../_helper/ControllerHelper';

export class CategoriesController {
    public static getList(req: IApplicationRequest, res: Response): void {
        CategoriesHelper.getCategories()
            .subscribe((categories: ICategory[]) => {
                ControllerHelper.Instance.sendData(categories, res);
            });
    }

    public static get(req: IApplicationRequest, res: Response): void {
        CategoriesHelper.getCategoryById(req.params.id)
            .subscribe((category: ICategory) => {
                ControllerHelper.Instance.sendData(category, res);
            });
    }

    public static post(req: IApplicationRequest, res: Response): void {
        const data = ControllerHelper.Instance.loadSchema(req.body, CategoriesHelper.createCategorySchema);
        const userId = req.currentUser._id;

        CategoriesHelper.addCategory(userId, data)
            .subscribe((category) => {
                ControllerHelper.Instance.sendData(category, res);
            });
    }

    public static put(req: IApplicationRequest, res: Response): void {
        const data = ControllerHelper.Instance.loadSchema(req.body, CategoriesHelper.updateCategorySchema);

        CategoriesHelper.updateCategory(data)
            .subscribe((category) => {
                ControllerHelper.Instance.sendData(category, res);
            });
    }

    public static delete(req: IApplicationRequest, res: Response): void {
        const data = ControllerHelper.Instance.loadSchema(req.body, CategoriesHelper.destroyCategorySchema);

        CategoriesHelper.destroyCategory(data.id)
            .subscribe((category) => {
                ControllerHelper.Instance.sendData(category, res);
            });
    }
}
