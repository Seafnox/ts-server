import * as unusedFilename from 'unused-filename';
import * as fs from 'fs';
import * as path from 'path';
import { File } from '../../interfaces/file.interface';

export class ImageHelper {
    public static readonly staticFilePath = './public';

    public static saveFile(file: File): string {
        ImageHelper.makeSureStaticFilePathExist();

        const safePath = this.getCustomFileName(file);
        fs.renameSync(path.join(file.destination, file.filename), safePath);

        return safePath;
    }

    public static getCustomFileName(file: File): string {
        return unusedFilename.sync(path.join(ImageHelper.staticFilePath, file.originalname));
    }

    public static isImage(file: File): boolean {
        return file.mimetype.startsWith('image');
    }

    private static makeSureStaticFilePathExist(): void {
        if (!fs.existsSync(ImageHelper.staticFilePath)) {
            fs.mkdirSync(ImageHelper.staticFilePath);
        }
    }
}
