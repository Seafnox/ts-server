import { BodyParams, Controller, Delete, Get, PathParams, Post, Put, MultipartFile } from '@tsed/common';
import { Required } from '@tsed/schema';
import { ArticlesService } from '../../services/article/articles.service';
import { Article } from '../../models/article/article';
import { CreateArticle } from '../../models/article/create-article';
import { UpdateArticle } from '../../models/article/update-article';
import { SmallArticle } from '../../models/article/small-article';
import { File } from '../../interfaces/file';
import { ImageHelper } from '../../helper/image/image.helper';
import { BadRequest } from 'ts-httpexceptions';

@Controller('/articles')
export class ArticleController {
    constructor(private readonly articlesService: ArticlesService) {}

    @Post('/')
    public create(@Required() @BodyParams() article: CreateArticle): Promise<Article> {
        return this.articlesService.create(article);
    }

    @Put('/:id')
    public update(
        @PathParams('id') id: string,
        @Required() @BodyParams() article: UpdateArticle,
    ): Promise<Article> {
        return this.articlesService.update(+id, article);
    }

    @Get('/')
    public async getList(): Promise<SmallArticle[]> {
        const articles = await this.articlesService.find();

        return articles.map(SmallArticle.fromArticle);
    }

    @Get('/:id')
    public async getArticle(
        @PathParams('id') id: string,
    ): Promise<Article> {
        return await this.articlesService.findOne(+id);
    }

    @Put('/:id/preview')
    public async patchAvatar(
        @PathParams('id') id: string,
        @MultipartFile('file') file: File,
    ): Promise<Article> {
        if (file && !ImageHelper.isImage(file)) {
            ImageHelper.deleteFile(file);

            throw(new BadRequest(`File could be only an image`));
        }

        const preview = file ? ImageHelper.saveFile(file) : '';
        const article = await this.articlesService.update(+id, {
            preview,
        });

        if (!article) {
            if (preview) {
                ImageHelper.deleteFileByPath(preview);
            }

            throw(new BadRequest(`Can't find article with id ${JSON.stringify(id)}`));
        }

        return article;
    }

    @Delete('/:id')
    public async delete(@PathParams('id') id: string): Promise<Article> {
        return this.articlesService.delete(+id);
    }
}
