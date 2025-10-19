// Update with your config settings.

require('dotenv').config(); // 👈 ОБЯЗАТЕЛЬНО ПЕРЕД module.exports

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
console.log( {
      host : process.env.DB_HOST || 'localhost',
      user : process.env.DB_USER || 'postgres',
      password : process.env.DB_PASSWORD || '123',
      database : process.env.DB_NAME || 'mydb'
    })
module.exports = {
  development: {
    client: 'pg',
    connection: {
      host : process.env.DB_HOST || 'localhost',
      user : process.env.DB_USER || 'postgres',
      password : process.env.DB_PASSWORD || '123',
      database : process.env.DB_NAME || 'mydb'
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations'
    }
  }
};
