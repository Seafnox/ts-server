import { startsWith } from 'lodash';
import * as jwt from 'jsonwebtoken';

let app = null;
import config from '../config';

export default {
  init,
  get: getRout,
  put: putRout,
  post: postRout,
  delete: deleteRout,
};

function init(expressApp) {
  app = expressApp;
}

function getRout(route, handler, options = {}) {
  const handlers = getHandlers(handler, options);

  app.get(route, handlers);
}

function putRout(route, handler, options = {}) {
  const handlers = getHandlers(handler, options);

  app.put(route, handlers);
}

function postRout(route, handler, options = {}) {
  const handlers = getHandlers(handler, options);

  app.post(route, handlers);
}

function deleteRout(route, handler, options = {}) {
  const handlers = getHandlers(handler, options);

  app.delete(route, handlers);
}

function getHandlers(handler, options) {
  setOptionsDefaults(options);

  const handlers = [];

  if (options.auth) {
    handlers.push(getAuthenticatedCheckHandler());
  }

  handlers.push(handler);

  return handlers;
}

function setOptionsDefaults(options) {
  // require auth by default
  if (options.auth === undefined) {
    options.auth = true;
  }
}

function getAuthenticatedCheckHandler() {
  return (req, res, next) => {
    const header = req.headers['authorization'] || req.headers['Authorization'];

    const token = parseTokenFromHeader(header);

    if (!token) {
      return res.status(403).send({
        success: false,
        message: 'No token provided.',
      });
    }

    // decode token
    // verifies secret and checks exp
    jwt.verify(token, config.auth.jwtKey, (err, decoded) => {
      if (err) {
        return res.status(401).send('Unauthorized');
      }

      req.currentUser = decoded;

      return next();
    });
  };

  function parseTokenFromHeader(header) {
    if (!header) { return null; }

    const prefix = 'Bearer ';

    if (!startsWith(header, prefix)) { return null; }

    return header.substring(prefix.length);
  }
}
