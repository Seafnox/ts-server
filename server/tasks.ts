import dbCreator from './database/dbCreator';

export default {
  run,
  seed,
};

const tasks = [{name: 'seed', description: 'Seeds DB with initial data.'}];

async function run(task) {
  if (!task) {
    return console.warn('Please, specify task to run.');
  }

  switch (task) {
    case 'list':
      console.info(tasks);
      break;
    case 'seed':
      await seed();
      break;
    default:
      console.error(`Unknown task "${task}".`);
  }
}

async function seed() {
  await dbCreator.createDb();
}
