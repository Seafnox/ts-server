import mongoose = require('mongoose');
import config from '../config';
import logger from '../logger';

export async function init() {
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
