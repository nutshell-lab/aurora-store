import { migrate } from './client'

type NutshellAuroraStoreConfig = {
  migrationsFolder: string
}

type NutshellAuroraStoreConfigParameters = {
  migrationsFolder?: string
}

let activeConfig: NutshellAuroraStoreConfig = {
  migrationsFolder: null
}

export const configure = (options: NutshellAuroraStoreConfigParameters) => {
  activeConfig = { ...activeConfig, ...options }
  migrate()
}

export const config = (): NutshellAuroraStoreConfig => ({ ...activeConfig }) // Giving consummer a copy of the object because to avoid Singleton effects
