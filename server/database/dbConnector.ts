import mongoose = require('mongoose');
import config from '../config';
import logger from '../logger';
import { ModelNames } from './modelNames.enum';
import { CategoryModel } from './models/category';
import { ProductModel } from './models/product';
import { UserModel } from './models/user';
import { ArticleModel } from './models/article';
import { ProductImageModel } from './models/product_image';

const models = {
    [ModelNames.User]: UserModel,
    [ModelNames.Product]: ProductModel,
    [ModelNames.Category]: CategoryModel,
    [ModelNames.Article]: ArticleModel,
    [ModelNames.ProductImage]: ProductImageModel,
};

export default {
    init,
    models,
};

async function init() {
    mongoose.Promise = Promise;

    const connectionStr = getConnectionString();

    try {
        await mongoose.connect(connectionStr, {
            connectTimeoutMS: config.db.timeout,
        });
    } catch (err) {
        logger.error('Could not connect to MongoDB!');
        logger.error(err);
    }

}

function getConnectionString() {
    let result = 'mongodb://';

    if (config.db.username) {
        result += config.db.username + ':' + config.db.password + '@';
    }

    result += config.db.host + ':' + config.db.port + '/' + config.db.name;

    return result;
}
