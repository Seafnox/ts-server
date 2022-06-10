import slugify from 'slugify';
import * as fs from 'fs';
import * as path from 'path';
import { unusedFilenameSync } from 'unused-filename';
import { File } from '../../interfaces/file';

export class ImageHelper {
    public static readonly staticFilePath = '/public';

    public static get relativeFilePath(): string {
        return `.${ImageHelper.staticFilePath}`;
    }

    public static saveFile(file: File): string {
        ImageHelper.makeSureStaticFilePathExist();

        const safePath = this.getCustomFileName(file);

        fs.renameSync(path.join(file.destination, file.filename), safePath);

        return `/${safePath}`;
    }

    public static deleteFile(file: File): void {
        fs.unlinkSync(path.join(file.destination, file.filename));
    }

    public static deleteFileByPath(filePath: string): void {
        const relativePath = filePath.replace(ImageHelper.staticFilePath, ImageHelper.relativeFilePath);

        if (fs.existsSync(relativePath)) {
            fs.unlinkSync(relativePath);
        }
    }

    public static getCustomFileName(file: File): string {
        const fileName = `${ImageHelper.fileNameSeed()} ${file.originalname}`;

        return unusedFilenameSync(path.join(ImageHelper.relativeFilePath, slugify(fileName)))
            .replace(`\\`, `/`);
    }

    public static isImage(file: File): boolean {
        return file.mimetype.startsWith('image');
    }

    private static fileNameSeed(): string {
        const stringficator = 36;
        const lastSymbols = 3;
        const date = Date.now()
            .toString(stringficator);
        // tslint:disable-next-line:no-magic-numbers
        const randomizer = Math.floor(Math.random() * 1000)
            .toString(stringficator);

        return `${date.substr(-lastSymbols)}${randomizer.substr(-lastSymbols)}`;
    }

    private static makeSureStaticFilePathExist(): void {
        if (!fs.existsSync(ImageHelper.relativeFilePath)) {
            fs.mkdirSync(ImageHelper.relativeFilePath);
        }
    }
}
