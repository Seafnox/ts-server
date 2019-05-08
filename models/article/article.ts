import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { MaxLength, MinLength, Property, Required } from '@tsed/common';
import { CreateArticle } from './create-article';

const maxNameLength = 50;
const maxShortDescriptionLength = 200;
const minNameLength = 3;

@Entity()
export class Article {
    @PrimaryGeneratedColumn()
    @Property()
    public id: number;

    @Column()
    @MaxLength(maxNameLength)
    @MinLength(minNameLength)
    @Required()
    public name: string;

    @Column()
    public preview: string;

    @Column()
    @MaxLength(maxShortDescriptionLength)
    @Required()
    public sortDescription: string;

    @Column()
    @Required()
    public description: string;


    public static fromCreateArticle(post: CreateArticle): Article {
        const result = new Article();
        const { name, sortDescription, description }: CreateArticle = post;

        Object.assign(result, { name, sortDescription, description });

        return result;
    }

}
