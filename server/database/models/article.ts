import mongoose = require('mongoose');
import { ModelNames } from '../modelNames.enum';

export interface IArticle extends mongoose.Document {
    name: string;
    title: string;
    description: string;
    userId?: string;
}

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
    },
});

export const ArticleModel = mongoose.model<IArticle>(ModelNames.Article, schema);
