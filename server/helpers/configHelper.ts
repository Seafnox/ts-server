import { readFileSync } from 'fs-extra';
import { forOwn, isString, isObject, clone, merge, set } from 'lodash';
import * as stripJsonComments from 'strip-json-comments';

export default {
  addJsonFile,
  loadEnvVars,
  printConfig,
};

function addJsonFile(config, path, required = false) {
  try {
    const fileVal = readFileSync(path, {encoding: 'utf8'});

    const fileJson = JSON.parse(stripJsonComments(fileVal));

    merge(config, fileJson);
  } catch (err) {
    if (required) {
      throw new Error(`Cannot read config file from ${path}`);
    }
  }
}

function loadEnvVars(config, envVars) {
  loadEnvVarsValues(config, envVars, []);
}

function loadEnvVarsValues(config, envVars, path) {
  forOwn(envVars, (value, key) => {
    if (isString(value)) {
      const newPath = clone(path);
      newPath.push(key);

      loadEnvVarValue(config, newPath, value);
    } else if (isObject(value)) {
      const newPath = clone(path);
      newPath.push(key);

      loadEnvVarsValues(config, value, newPath);
    } else {
      throw new Error('Unsupported ENV VARS mapping structure');
    }
  });
}

function loadEnvVarValue(config, path, envVar) {
  if (process.env[envVar]) {
    set(config, path, process.env[envVar]);
  }
}

function printConfig(config) {
  console.info('App configuration:');
  console.info(JSON.stringify(config, null, 2));
}
