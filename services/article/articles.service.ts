import { Service, AfterRoutesInit } from '@tsed/common';
import { TypeORMService } from '@tsed/typeorm';
import { Connection, EntityManager } from 'typeorm';
import { ImageHelper } from '../../helper/image/image.helper';
import { Article } from '../../models/article/article';
import { CreateArticle } from '../../models/article/create-article';

@Service()
export class ArticlesService implements AfterRoutesInit {
    private connection: Connection;

    constructor(private readonly typeORMService: TypeORMService) {}

    private get manager(): EntityManager {
        return this.connection.manager;
    }

    public $afterRoutesInit(): void {
        this.connection = this.typeORMService.get();
    }

    public async create(data: CreateArticle): Promise<Article> {
        return await this.manager.save(Article.fromCreateArticle(data));
    }

    public async find(): Promise<Article[]> {
        return await this.manager.find(Article);
    }

    public async findOne(id: number): Promise<Article | undefined> {
        return await this.manager.findOne(Article, id);
    }

    public async update(id: number, data: Partial<Article>): Promise<Article | undefined> {
        await this.manager.update(Article, id, data);

        return await this.findOne(id);
    }

    public async delete(id: number): Promise<undefined | Article> {
        const entity = await this.findOne(id);

        await this.manager.delete(Article, id);
        if (entity) {
            ImageHelper.deleteFileByPath(entity.preview);
        }

        return entity;
    }
}
