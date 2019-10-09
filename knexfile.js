require('dotenv').config()
// Database, Migration and Seed Setup
module.exports = {

  development: {
    client: 'pg',
    connection: {
      database: 'simple' // Replace this with your DB name.
    },
    migrations: {
        directory: __dirname + '/db/migrations',
    },
    seeds: {
        directory: __dirname + '/db/seeds',
    }
  },

  production: {
    client: 'pg',
    connection: process.env.SIMPLE_DATABASE_URL,
    // connection: {
    //   host : process.env.SIMPLE_DATABASE_HOST,
    //   user : process.env.SIMPLE_DATABASE_USERNAME,
    //   password : process.env.SIMPLE_DATABASE_PASSWORD,
    //   database : process.env.SIMPLE_DATABASE_NAME
    // },
    ssl: true,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
        directory: __dirname + '/db/migrations',
    },
    seeds: {
        directory: __dirname + '/db/seeds',
    }
  }

};
