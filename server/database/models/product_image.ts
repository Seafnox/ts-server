import * as mongoose from 'mongoose';
import { ModelNames } from '../modelNames.enum';
import { Dictionary } from 'express-validator/shared-typings';

export interface IProductImage extends mongoose.Document, IProductImageData {}

export interface IProductImageData {
    url: string;
    thumbs: Dictionary<string>;
    userId?: string;
}

const schema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        unique: true,
    },
    thumbs: {
        type: Object,
        required: true,
    },
    userId: {
        type: String,
    },
});

export const ProductImageModel = mongoose.model<IProductImage>(ModelNames.ProductImage, schema);
