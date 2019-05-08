import { Article } from './article';
import { Property } from '@tsed/common';

export class CreateArticle implements Article {
    public id: number;

    public preview: string;

    @Property()
    public name: string;

    @Property()
    public sortDescription: string;

    @Property()
    public description: string;
}
