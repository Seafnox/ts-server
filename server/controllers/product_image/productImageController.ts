import { IAppRequest } from '../../interfaces/AppRequest';
import { Observable, throwError } from 'rxjs';
import { IAppAnswer } from '../../interfaces/ControllerAction';
import { ProductImageHelper } from './productImageHelper';
import { map, switchMap } from 'rxjs/operators';
import pathHelper from '../../helpers/pathHelper';
import { UploadedFile } from 'express-fileupload';
import { fromPromise } from 'rxjs/internal-compatibility';

export class ProductImageController {
    public static get(req: IAppRequest): Observable<IAppAnswer> {
        return ProductImageHelper
            .findById(req.params.id)
            .pipe(map((data) => ({data})));
    }

    public static getAll(): Observable<IAppAnswer> {
        return ProductImageHelper
            .findAll()
            .pipe(map((data) => ({data})));
    }

    public static post(req: IAppRequest): Observable<IAppAnswer> {
        if (!req.files) {
            return throwError('No files were uploaded.');
        }

        if (Array.isArray(req.files.file)) {
            return throwError('Only one file must be uploaded.');
        }

        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        const file = <UploadedFile>req.files.file;
        const newName = `${file.name}_${Date.now().toString(36)}`;
        const path = `${pathHelper.getDataRelative('/public')}/${newName}`;
        const url = `/public/${newName}`;
        const userId = req.currentUser._id;

        // Use the mv() method to place the file somewhere on your server
        return fromPromise(file.mv(path))
            .pipe(
                switchMap(() => ProductImageHelper.create({url}, userId)),
                map((image) => ({data: image})),
            );
    }

    public static put(req: IAppRequest): Observable<IAppAnswer> {
        return throwError('No update available');
    }

    public static delete(req: IAppRequest): Observable<IAppAnswer> {
        return throwError('No delete available');
    }
}
