import pathHelper from '../helpers/pathHelper';
import { IApplicationRequest } from '../interfaces/ApplicationRequest';
import { Response } from 'express';

export class IndexController {
    public static index(req: IApplicationRequest, res: Response): void {
        res.sendFile(pathHelper.getClientRelative('index.html'));
    }
}
