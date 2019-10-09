const config = require('../knexfile.js');
const database = require('knex')(config[process.env.NODE_ENV] || config['development']);

// On API startup, this will run knex migrate:latest to ensure that our DB is up to date.
const knexSetup = async () => {
  if (process.env.NODE_ENV != 'development') {
    console.log('>>> Production Environment Detected: Running `knex migrate:latest`.')
    await database.migrate.latest('production')
    console.log('>>> Migrations Complete.')
  } if (process.env.NODE_ENV == 'development') {
    console.log('>>> Development Environment Detected: Running `database migrate:latest`.')
    await database.migrate.latest('development')
    console.log('>>> Migrations Complete.')
  }
}

// This log just let's us know Knex started properly.
// const knexSetup = async () => { console.log('Knex Database Connected...') };
knexSetup();

module.exports = database;
