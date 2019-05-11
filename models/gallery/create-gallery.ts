import { Gallery } from './gallery';
import { Property } from '@tsed/common';
import { GalleryItem } from '../gallery-item/gallery-item';

export class CreateGallery implements Gallery {
    public id: number;

    @Property()
    public name: string;

    public items: GalleryItem[];

    @Property()
    public sortDescription: string;
}
