import Knex from 'knex'
import fs from 'fs'
import path from 'path'
import { migrations as config } from '../knexfile'

const context = fs.readdirSync(path.join(__dirname, '../', config.directory))

const envSwitch = {
  local: {
    host: process.env.LOCAL_DB_HOST,
    port: Number.parseInt(process.env.LOCAL_DB_PORT),
    database: process.env.LOCAL_DB_NAME,
    user: process.env.LOCAL_DB_USER,
    password: process.env.LOCAL_DB_PASSWD
  },
  default: {
    host: process.env.DB_HOST,
    port: Number.parseInt(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWD
  }
}

const dbEnv = () => process.env.SLS_STAGE === 'local' ? envSwitch.local : envSwitch.default

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
      host: dbEnv().host,
      port: dbEnv().port,
      database: dbEnv().database,
      user: dbEnv().user,
      password: dbEnv().password
    },
    ...options
  })

const migrate = async (connexion: Knex) => {
  return connexion.migrate
    .latest({ migrationSource })
    .then(([latestIndex, done]) => console.log(`
      [knex] Current migration level : ${latestIndex}
      [knex] ${done.length} migrations have been done right now.
    `))
    .catch(error => console.log('[knex]', 'migrations error', { error }))
}

const migrations = migrate(connectToDb())

export default (options?: Knex.Config) =>
  Promise.resolve(migrations).then(() => connectToDb(options))
