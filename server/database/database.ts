import mongoose from 'mongoose';
import * as _ from 'lodash';
import config from '../config';
import logger from '../logger';

const models = {
  User: null,
  Record: null,
  Category: null,
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
    console.error('Could not connect to MongoDB!');
    logger.error(err);
  }

  // init models
  Object.keys(models).forEach((modelName) =>
    models[modelName] = require(`./models/${_.lowerCase(modelName)}`));
}

function getConnectionString() {
  let result = 'mongodb://';

  if (config.db.username) {
    result += config.db.username + ':' + config.db.password + '@';
  }

  result += config.db.host + ':' + config.db.port + '/' + config.db.name;

  return result;
}
