process.on('uncaughtException', (err) => {
    console.error(`Uncaught exception. ${err.toString()} ${err.stack}`);
});

import { startServer } from './server';
import config from './config';
import tasks from './tasks';

async function start(): Promise<void> {
    if (config.db.seedOnStart) {
        await tasks.seed();
    }

    const port = process.env.PORT || config.port;

    startServer(port);

    console.info(`Server is listening on port ${port}!`);

    console.info(`Server started.`);
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
