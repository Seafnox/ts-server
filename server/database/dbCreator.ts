import { init } from './dbConnector';
import seeder from './seeders/seederDefault';

export default {
  createDb,
};

async function createDb() {
  try {
    await init();

    await seeder.seedData();

    console.info('DB was seeded!');
  } catch (err) {
    console.error(`Data Seed error`);
    console.error(`Error: ${err}`);
  }
}
