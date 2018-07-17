import * as mongoose from 'mongoose';
import { ModelNames } from '../modelNames.enum';

export interface IProduct extends mongoose.Document {
    name: string;
    title: string;
    categories: string[];
    description: string;
    images: string[];
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
    categories: {
        type: Array,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    images: {
        type: Array,
        required: true,
    },
    userId: {
        type: String,
    },
});

export const ProductModel = mongoose.model<IProduct>(ModelNames.Product, schema);
