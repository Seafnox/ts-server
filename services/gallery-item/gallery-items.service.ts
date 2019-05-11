import { Connection, EntityManager, Repository } from 'typeorm';
import { TypeORMService } from '@tsed/typeorm';
import { Gallery } from '../../models/gallery/gallery';
import { ImageHelper } from '../../helper/image/image.helper';
import { GalleryItem } from '../../models/gallery-item/gallery-item';

export class GalleryItemsService {
    private connection: Connection;

    constructor(private readonly typeORMService: TypeORMService) {}

    public $afterRoutesInit(): void {
        this.connection = this.typeORMService.get();
    }

    public async create(entity: GalleryItem): Promise<GalleryItem> {
        return await this.manager.save(entity);
    }

    public async find(): Promise<Gallery[]> {
        return await this.repo.find();
    }

    public async findOne(id: number): Promise<Gallery> {
        return await this.repo.findOne(id, {
            relations: ['items'],
        });
    }

    public async update(id: number, galleryData: Partial<Gallery>): Promise<Gallery> {
        await this.manager.update(Gallery, id, galleryData);

        return await this.findOne(id);
    }

    public async delete(id: number): Promise<Gallery> {
        const gallery = await this.findOne(id);

        await this.manager.delete(Gallery, id);
        gallery.items.forEach((item) => ImageHelper.deleteFileByPath(item.path));

        return gallery;
    }

    private get manager(): EntityManager {
        return this.connection.manager;
    }

    private get repo(): Repository<Gallery> {
        return this.connection.getRepository(Gallery);
    }
}
