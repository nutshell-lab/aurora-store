
import { isEmpty } from 'ramda'
import { throwError, on } from '@nutshelllab/ferrors'
import connect from './client'
import Knex from 'knex'

interface Connector<T> {
  kind?: string
  validate?: (data: any) => any
  idField?: (keyof T)[] | ['id']
}

type Store<T> = {
  db?: Function
  idField?: (keyof T)[]
  tableName?: string
  validate?: (data: any) => any
  findIn?: (field: keyof T, values: any) => Promise<T[]>
  findAll?: (filters?: object) => Promise<T[]>
  find?: (filters: object) => Promise<T>
  put?: (obj: T) => Promise<T>
  update?: (obj: T) => Promise<T>
  create?: (obj: T) => Promise<T>
  applyPk?: (client: Knex.QueryBuilder, pks: (keyof T)[], obj: T) => Knex.QueryBuilder
  findOrCreate?: (filters: object, obj: T) => Promise<T>
  remove?: (filters: object) => Promise<T>
  truncate?: ({ force: boolean }) => Promise<void>
  knexClient?: () => Promise<Knex>
}

const printList = (list = []) => list.join(' ')
const throwBadArgument = args =>
  throwError(
    'INVALID_ARGUMENT',
    `function was badly called with arguments ${printList(
      args
    )}`
  )

export { configure } from './config'

export default <T>({ kind, idField = [ 'id' ], validate = (data: any) => data }: Connector<T>): Store<T> => {
  const store: Store<T> = {
    tableName: kind,
    idField: idField as (keyof T)[],
    validate: validate
  }

  store.applyPk = (client, pks, data) =>
    pks.reduce(
      (client, key) => client.where(key, data[key]),
      client
    )

  store.findIn = async (field, values) => {
    if (isEmpty(field) || isEmpty(values)) throwBadArgument([field, values])

    return connect().then(db => db(store.tableName).whereIn(field, values))
  }

  store.findAll = async (filters = {}) => {
    return connect().then(db => db(store.tableName).where(filters))
  }

  store.find = async (filters) => {
    const existing = await connect().then(db => db(store.tableName)
      .where(filters)
      .returning('*')
      .first())

    return existing
      ? store.validate(existing)
      : throwError('NOT_FOUND', `Entity could not be found with filters ${Object.values(filters)}`, filters)
  }

  store.put = async (data) => {
    if (isEmpty(data)) throwBadArgument(Object.entries(data))

    const result = (await store.update(data)) || (await store.create(data))
    return store.validate(result)
  }

  store.update = async (data) => {
    if (isEmpty(data)) throwBadArgument(Object.entries(data))

    return connect().then(async db =>
      store.applyPk(db(store.tableName), store.idField, data)
        .update(store.validate(data), ['*'])
        .then(x => (Array.isArray(x) ? x[0] : null)) // Knex forbid using first on update queries
    )
  }

  store.create = async (data) => {
    if (isEmpty(data)) throwBadArgument(Object.entries(data))

    return connect().then(db => db(store.tableName)
      .insert(store.validate(data))
      .returning('*')
      .then(x => (Array.isArray(x) ? x[0] : null))) // Knex forbid using first on insert queries
  }

  store.findOrCreate = async (filters, data) => {
    return store.find(filters)
      .catch(on('NOT_FOUND', () => store.create(data)))
      .then(store.validate)
  }

  store.remove = async (filters) => {
    const existing = await store.find(filters)
    return existing
      ? connect().then(db => db(store.tableName).where(filters).delete())
      : store.validate(existing)
  }

  store.truncate = async ({ force = false }) => {
    const notEmpty = (await store.findAll()).length > 0
    if(notEmpty && !force)
      throwError('OPERATION_REJECTED', `Cannot truncate table ${store.tableName} without force mode. Override with { force: true } param.`)
    return connect().then(db => db(store.tableName).truncate())
  }

  store.knexClient = connect

  return store
}
