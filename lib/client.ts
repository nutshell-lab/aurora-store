import Knex from 'knex'
import fs from 'fs'
import path from 'path'
import { migrations as config } from '../knexfile'

const context = fs.readdirSync(path.join(__dirname, '../', config.directory))

const migrationSource = {
    getMigrations() {
      return Promise.resolve(context)
    },
    getMigrationName(migration: string) {
      return migration
    },
    getMigration(migration: string) {
      return require(path.join(__dirname, '../', config.directory, migration))
    }
}

const connectToDb = (options?: Knex.Config) =>
  Knex({
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: Number.parseInt(process.env.DB_PORT),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWD
    },
    ...options
  })


const migrate = async (connexion: Knex) => {
  return connexion.migrate
    .latest({ migrationSource })
    .then(response => console.log('[knex]', 'migrations done', { response }))
    .catch(error => console.log('[knex]', 'migrations error', { error }))
}

const migrations = Promise.resolve().then(() => migrate(connectToDb()))

export default (options?: Knex.Config) =>
  Promise.resolve(migrations).then(() => connectToDb(options))
