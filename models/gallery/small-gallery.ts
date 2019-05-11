import { Gallery } from './gallery';
import { Property } from '@tsed/common';
import { GalleryItem } from '../gallery-item/gallery-item';

export class SmallGallery implements Gallery {
    @Property()
    public id: number;

    @Property()
    public name: string;

    @Property()
    public sortDescription: string;

    public items: GalleryItem[];

    public static fromGallery(gallery: Gallery): SmallGallery {
        const result = new SmallGallery();
        const { id, name, sortDescription }: Gallery = gallery;

        Object.assign(result, { id, name, sortDescription });

        return result;
    }
}
