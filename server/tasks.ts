import dbCreator from './database/dbCreator';

export default {
    run,
    seed,
};

const tasks = [{name: 'seed', description: 'Seeds DB with initial data.'}];

async function run(task: string) {
    if (!task) {
        return console.warn('Please, specify task to run.');
    }

    const taskRunners: Record<string, () => void> = {
        list: async () => console.info(tasks),
        seed: async () => await seed(),
    };

    if (typeof taskRunners[task] !== 'function') {
        return console.error(`Unknown task "${task}".`);
    }
}

async function seed() {
    await dbCreator.createDb();
}
