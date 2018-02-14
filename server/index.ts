process.on('uncaughtException', (err) => {
  const stack = err.stack;
  console.error(`Uncaught exception. ${err}`);
});

import server from './server';
import config from './config';
import logger from './logger';
import tasks from './tasks';

async function start() {
  if (config.db.seedOnStart) {
    await tasks.seed();
  }

  const port = await server.start(process.env.PORT || config.port);

  console.info(`Server is listening on port ${port}!`);

  logger.info(`Server started.`);
}

const run = async () => {
  const args = process.argv;

  // run task
  if (args[2] === 'run') {
    await tasks.run(args[3]);
    process.exit(0);
    // run server
  } else {
    await start();
  }
};

run();
