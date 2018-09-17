import * as mongoose from 'mongoose';
import { ModelNames } from '../modelNames.enum';

export interface IProductImage extends mongoose.Document, IProductImageData {}

export interface IProductImageData {
    url: string;
    userId?: string;
}

const schema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: String,
    },
});

export const ProductImageModel = mongoose.model<IProductImage>(ModelNames.ProductImage, schema);
