import { Gallery } from './gallery';
import { Property } from '@tsed/common';
import { GalleryItem } from '../gallery-item/gallery-item';

export class UpdateGallery implements Gallery {
    public id: number;

    @Property()
    public name: string;

    @Property()
    public sortDescription: string;

    public items: GalleryItem[];
}
