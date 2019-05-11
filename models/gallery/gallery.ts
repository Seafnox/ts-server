import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MaxLength, MinLength, Property, Required } from '@tsed/common';
import { CreateGallery } from './create-gallery';
import { GalleryItem } from '../gallery-item/gallery-item';

const maxNameLength = 50;
const maxShortDescriptionLength = 200;
const minNameLength = 3;

@Entity()
export class Gallery {
    @PrimaryGeneratedColumn()
    @Property()
    public id: number;

    @Column()
    @MaxLength(maxNameLength)
    @MinLength(minNameLength)
    @Required()
    public name: string;

    @OneToMany(() => GalleryItem, (item) => item.gallery)
    public items: GalleryItem[];

    @Column()
    @MaxLength(maxShortDescriptionLength)
    @Required()
    public sortDescription: string;


    public static fromCreateGallery(gallery: CreateGallery): Gallery {
        const result = new Gallery();
        const { name, sortDescription }: CreateGallery = gallery;

        Object.assign(result, { name, sortDescription });

        return result;
    }

}
