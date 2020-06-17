
import { isEmpty } from 'ramda'
import { throwError, reThrow } from '@nutshelllab/ferrors'
import connect from './client'

interface Connector<T> {
  kind?: string
  validate?: Function
  idField?: keyof T
}

export default <T>({ kind, validate, idField }: Connector<T>) => async () => {
  const client = await connect().catch(reThrow('DB_CONNECTION_ERROR'))

  const store = {
    create: async (data: T) => {
      if (isEmpty(data))
        throwError('INVALID_ARGUMENT', 'Cannot create, provided data is empty')
      return client(kind)
        .insert(validate(data))
        .returning('*')
        .then(x => (Array.isArray(x) ? x[0] : null)) // Knex forbid using first on insert queries
    },

    find: async (id: T[keyof T]) => {
      const existing = await client(kind)
        // .where(idField, id)
        .returning('*')
        .first()

      return existing
        ? validate(existing)
        : throwError(
            'ORG_NOT_FOUND',
            `could not found entity ${id} in ${kind}`
          )
    },

    findOrCreate: async (data: T) => {
      const id =
        data[idField] ||
        throwError(
          'INVALID_ARGUMENT',
          `Cannot find or create entity : entity has no ${idField} field, try pass optional idField parameter.`
        )
      const existing = await store.find(id)
      const entity = existing || (await store.create(data))
      return validate(entity)
    },

    update: async (data: T) => {
      if (isEmpty(data))
        throwError('INVALID_ARGUMENT', 'Cannot update, provided data is empty')
      return client(kind)
        .where(idField, data[idField])
        .update(validate(data), '*')
        .then(x => {
          console.log('HELLO HELLO', x)
          return x
        })
        .then(x => (Array.isArray(x) ? x[0] : null)) // Knex forbid using first on update queries
    },

    updateOrCreate: async (data: T) => {
      if (isEmpty(data))
        throwError(
          'INVALID_ARGUMENT',
          'Cannot updateOrCreate, provided data is empty'
        )
      const result = (await store.update(data)) || (await store.create(data))
      console.log('result is', result)
      return validate(result)
    }
  }

  return Object.freeze(store)
}
