import Knex from 'knex'
import fs from 'fs'
import path from 'path'
import { config } from './config'

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

const dbEnv = process.env.SLS_STAGE === 'local' ? envSwitch.local : envSwitch.default

let configuration: Knex.Config = {
  client: 'pg',
  connection: {
    host: dbEnv.host,
    port: dbEnv.port,
    database: dbEnv.database,
    user: dbEnv.user,
    password: dbEnv.password
  },
  pool: {
    min: 1,
    max: 4
  }
}


const migrationSource = () => {
  const context = fs.readdirSync(config().migrationsFolder)
  
  return {
    getMigrations() {
      return Promise.resolve(context)
    },
    getMigrationName(migration: string) {
      return migration
    },
    getMigration(migration: string) {
      return require(path.join(config().migrationsFolder, migration))
    }
  }
}

const client = Knex(configuration)

let migrations = Promise.resolve()

export const migrate = async () => {
  if(!config().migrationsFolder && !config().migrationSource) throw 'Module has not been configured. Please call configure method with migrationsFolder argument'
  migrations = client.migrate
    .latest({ migrationSource: config().migrationsFolder ? migrationSource() : config().migrationSource })
    .then(([latestIndex, done]) => console.log(`
      [knex] Current migration level : ${latestIndex}
      [knex] ${done.length} migrations have been done right now.
    `))
    .catch(error => console.log('[knex]', 'migrations error', { error }))
}

export default (options?: Knex.Config) =>
  migrations.then(() => client)
