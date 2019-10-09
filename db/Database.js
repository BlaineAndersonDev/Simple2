var pg = require('pg');
pg.defaults.ssl = true;

const config = require('../knexfile.js');
const database = require('knex')(config[process.env.NODE_ENV] || config['development']);

const knexMigrations = async (production) => {
  console.log('>>> Running `knex migrate:latest`...')
  if (production == true) {
    await database.migrate.latest('production')
  } else {
    await database.migrate.latest('development')
  }
  console.log('>>> Migration Complete.')
};

const knexSeeds = async (production) => {
  console.log('>>> Running `knex seed:run`...')
  if (production == true) {
    await database.seed.run('production')
  } else {
    await database.seed.run('development')
  }
  console.log('>>> Seed Complete.')
};

// On API startup, this will run knex migrate:latest to ensure that our DB is up to date.
const knexSetup = async () => {
  if (process.env.NODE_ENV != 'development') {
    console.log('>>> Production Environment Detected <<<')
  } else {
    console.log('>>> Development Environment Detected <<<')
  }
  await knexMigrations()
  await knexSeeds()
  console.log('>>> Knex Setup Completed <<<')
}

knexSetup();

module.exports = database;
