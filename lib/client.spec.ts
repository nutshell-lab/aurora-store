import test from 'ava'
import connect from './client'
import '../__fixtures__/initialize-env'

test.serial('A connection can be made to a database', async t => {
  await t.notThrowsAsync(connect().then(client => client('movies')))
})
