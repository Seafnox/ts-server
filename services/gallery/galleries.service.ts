import { Service, AfterRoutesInit } from '@tsed/common';
import { TypeORMService } from '@tsed/typeorm';
import { Connection, EntityManager, Repository } from 'typeorm';
import { ImageHelper } from '../../helper/image/image.helper';
import { Gallery } from '../../models/gallery/gallery';
import { CreateGallery } from '../../models/gallery/create-gallery';

@Service()
export class GalleriesService implements AfterRoutesInit {
    private connection: Connection;

    constructor(private readonly typeORMService: TypeORMService) {}

    private get manager(): EntityManager {
        return this.connection.manager;
    }

    private get repo(): Repository<Gallery> {
        return this.connection.getRepository(Gallery);
    }

    public $afterRoutesInit(): void {
        this.connection = this.typeORMService.get();
    }

    public async create(data: CreateGallery): Promise<Gallery> {
        return await this.manager.save(Gallery.fromCreateGallery(data));
    }

    public async find(): Promise<Gallery[]> {
        return await this.repo.find();
    }

    public async findOne(id: number): Promise<Gallery | undefined> {
        return await this.repo.findOne(id, {
            relations: ['items'],
        });
    }

    public async update(id: number, data: Partial<Gallery>): Promise<Gallery | undefined> {
        await this.manager.update(Gallery, id, data);

        return await this.findOne(id);
    }

    public async delete(id: number): Promise<Gallery | undefined> {
        const entity = await this.findOne(id);

        await this.manager.delete(Gallery, id);
        entity?.items.forEach((item): void => ImageHelper.deleteFileByPath(item.path));

        return entity;
    }
}
