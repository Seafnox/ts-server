import db from './database';
import seeder from './seeders/seederDefault';

export default {
  createDb,
};

async function createDb() {
  try {
    await db.init();

    await seeder.seedData(db);

    console.info('DB was seeded!');
  } catch (err) {
    console.error(`Data Seed error`);
    console.error(`Error: ${err}`);
  }
}
