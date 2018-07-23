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
        // const data = await _helper.loadSchema(req.body, {
        //     category: Joi.object().keys({
        //         id: Joi.string().allow(null),
        //         title: Joi.string().required(),
        //         description: Joi.string().required(),
        //     }),
        // });
        //
        // const userId = req.currentUser._id;
        //
        // let category = null;
        //
        // if (data.category.id) {
        //     await assertUserOwnsCategory(userId, data.category.id);
        //
        //     category = await categoryRepository.updateCategory(data.category);
        // } else {
        //     category = await categoryRepository.addCategory(userId, data.category);
        // }
        //
        // return _helper.sendData(category, res);
    }
    public static put(req: IApplicationRequest, res: Response): void {}
    public static delete(req: IApplicationRequest, res: Response): void {
        // const data = await _helper.loadSchema(req.params, {
        //     id: Joi.string().required(),
        // });
        //
        // await assertUserOwnsCategory(_helper.getCurrentUser(req)._id, data.id);
        //
        // await categoryRepository.removeCategory(data.id);
        //
        // return _helper.sendData({}, res);
    }
}
