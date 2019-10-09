var pg = require('pg');
pg.defaults.ssl = true;

const config = require('../knexfile.js');
const database = require('knex')(config[process.env.NODE_ENV] || config['development']);

// On API startup, this will run knex migrate:latest to ensure that our DB is up to date.
// const knexSetup = async () => {
//   if (process.env.NODE_ENV != 'development') {
//     console.log('>>> Production Environment Detected: Running `knex migrate:latest`.')
//     await database.migrate.latest('production')
//     console.log('>>> Migrations Complete.')
//     await database.seed.run('production')
//     console.log('>>> Seed Complete.')
//   } else if (process.env.NODE_ENV == 'development') {
//     console.log('>>> Development Environment Detected: Running `database migrate:latest`.')
//     await database.migrate.latest('development')
//     console.log('>>> Migrations Complete.')
//     await database.seed.run('production')
//     console.log('>>> Seed Complete.')
//   }
// }
// knexSetup();

module.exports = database;
