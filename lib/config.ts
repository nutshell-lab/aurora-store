import Knex from 'knex'

type NutshellAuroraStoreConfig = {
  migrationsFolder: string
  migrationSource: Knex.MigrationSource<any>
}

type NutshellAuroraStoreConfigParameters = {
  migrationsFolder?: string
  migrationSource?: Knex.MigrationSource<any>
}

let activeConfig: NutshellAuroraStoreConfig = {
  migrationsFolder: null,
  migrationSource: null
}

export const configure = (options: NutshellAuroraStoreConfigParameters) => {
  activeConfig = { ...activeConfig, ...options }
}

export const config = (): NutshellAuroraStoreConfig => ({ ...activeConfig }) // Giving consummer a copy of the object because to avoid Singleton effects
