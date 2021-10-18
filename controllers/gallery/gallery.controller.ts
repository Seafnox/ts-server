import { BodyParams, Controller, Delete, Get, PathParams, Post, Put } from '@tsed/common';
import { Required } from '@tsed/schema';
import { GalleriesService } from '../../services/gallery/galleries.service';
import { CreateGallery } from '../../models/gallery/create-gallery';
import { Gallery } from '../../models/gallery/gallery';
import { UpdateGallery } from '../../models/gallery/update-gallery';
import { SmallGallery } from '../../models/gallery/small-gallery';

// const maxFileCount = 5;

@Controller('/galleries')
export class GalleryController {
    constructor(private readonly galleriesService: GalleriesService) {}

    @Post('/')
    public create(@Required() @BodyParams() gallery: CreateGallery): Promise<Gallery> {
        return this.galleriesService.create(gallery);
    }

    @Put('/:id')
    public update(
        @PathParams('id') id: string,
        @Required() @BodyParams() gallery: UpdateGallery,
    ): Promise<Gallery> {
        return this.galleriesService.update(+id, gallery);
    }

    @Get('/')
    public async getList(): Promise<SmallGallery[]> {
        const galleries = await this.galleriesService.find();

        return galleries.map(SmallGallery.fromGallery);
    }

    @Get('/:id')
    public async getGallery(
        @PathParams('id') id: string,
    ): Promise<Gallery> {
        return await this.galleriesService.findOne(+id);
    }

    // @Put('/:id/preview')
    // public async patchAvatar(
    //     @PathParams('id') id: string,
    //     @MultipartFile('files', maxFileCount) files: File[],
    // ): Promise<Gallery> {
    //     if (Array.isArray(files)) {
    //         if (files.some((file) => file && !ImageHelper.isImage(file))) {
    //             files.forEach(ImageHelper.deleteFile);
    //
    //             throw(new BadRequest(`File could be only an image`));
    //         }
    //     }
    //
    //     // const preview = file ? ImageHelper.saveFile(file) : '';
    //     // const gallery = await this.galleriesService.update(+id, {
    //     //     preview,
    //     // });
    //     //
    //     // if (!gallery) {
    //     //     if (preview) {
    //     //         ImageHelper.deleteFileByPath(preview);
    //     //     }
    //     //
    //     //     throw(new BadRequest(`Can't find gallery with id ${JSON.stringify(id)}`));
    //     // }
    //     //
    //     // return gallery;
    //
    //     return await this.galleriesService.findOne(+id);
    // }

    @Delete('/:id')
    public async delete(@PathParams('id') id: string): Promise<Gallery> {
        return this.galleriesService.delete(+id);
    }
}
