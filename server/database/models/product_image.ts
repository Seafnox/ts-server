import * as mongoose from 'mongoose';
import { ModelNames } from '../modelNames.enum';

export interface IProductImage extends mongoose.Document {
    url: string;
    thumbs: string[];
    userId?: string;
}

const schema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        unique: true,
    },
    thumbs: {
        type: Array,
        required: true,
    },
    userId: {
        type: String,
    },
});

export const ProductImageModel = mongoose.model<IProductImage>(ModelNames.ProductImage, schema);
