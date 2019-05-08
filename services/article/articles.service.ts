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

    public $afterRoutesInit(): void {
        this.connection = this.typeORMService.get();
    }

    public async create(article: CreateArticle): Promise<Article> {
        return await this.manager.save(Article.fromCreateArticle(article));
    }

    public async find(): Promise<Article[]> {
        return await this.manager.find(Article);
    }

    public async findOne(id: number): Promise<Article> {
        return await this.manager.findOne(Article, id);
    }

    public async update(id: number, articleData: Partial<Article>): Promise<Article> {
        await this.manager.update(Article, id, articleData);

        return await this.findOne(id);
    }

    public async delete(id: number): Promise<Article> {
        const article = await this.findOne(id);

        await this.manager.delete(Article, id);
        ImageHelper.deleteFileByPath(article.preview);

        return article;
    }

    private get manager(): EntityManager {
        return this.connection.manager;
    }
}
