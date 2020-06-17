// This file is only used for knex command line tool
// If you're looking for runtime config, see ./src/core/database/using-database.ts

module.exports = {
  client: 'pg',
  migrations: {
    directory: './__fixtures__/migrations'
  }
}
