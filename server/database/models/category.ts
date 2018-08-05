import mongoose = require('mongoose');
import { ModelNames } from '../modelNames.enum';

export interface ICategory extends mongoose.Document, ICategoryData {}

export interface ICategoryData {
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

export const CategoryModel = mongoose.model<ICategory>(ModelNames.Category, schema);
