import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Property, Required } from '@tsed/schema';
import { Gallery } from '../gallery/gallery';

@Entity()
export class GalleryItem {
    @PrimaryGeneratedColumn()
    @Property()
    public id: number;

    @Column()
    @Required()
    public path: string;

    @ManyToOne(() => Gallery, (gallery) => gallery.items)
    @Required()
    public gallery: Gallery;

}
