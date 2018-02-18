process.on('uncaughtException', (err) => console.error(`Uncaught exception. ${err.toString()} ${err.stack}`));

import server from './server';
import config from './config';
import logger from './logger';
import tasks from './tasks';

async function start(): Promise<void> {
  if (config.db.seedOnStart) {
    await tasks.seed();
  }

  const port = await server.start(process.env.PORT || config.port);

  console.info(`Server is listening on port ${port}!`);

  logger.info(`Server started.`);
}

async function run(): Promise<void> {
  const args = process.argv;

  // run task
  if (args[2] === 'run') {
    await tasks.run(args[3]);
    process.exit(0);
    // run server
  } else {
    await start();
  }
}

run().catch((err) => {
  throw err;
});
