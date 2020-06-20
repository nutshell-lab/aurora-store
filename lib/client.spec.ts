import test from 'ava'
import '../__fixtures__/initialize-env'
import { configure } from './index'
import connect from './client'
import path from 'path'

configure({
  migrationsFolder: path.join(__dirname, '../__fixtures__/migrations')
})

test.serial('A connection can be made to a database', async t => {
  await t.notThrowsAsync(connect().then(client => client('movies')))
})
