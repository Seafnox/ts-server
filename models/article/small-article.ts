import { Article } from './article';
import { Property } from '@tsed/common';

export class SmallArticle implements Article {
    @Property()
    public id: number;

    @Property()
    public name: string;

    @Property()
    public sortDescription: string;

    public preview: string;

    public description: string;

    public static fromArticle(article: Article): SmallArticle {
        const result = new SmallArticle();
        const { id, name, sortDescription }: Article = article;

        Object.assign(result, { id, name, sortDescription });

        return result;
    }

}
