import test from 'ava'
import connect from './client'

process.env.DB_HOST = '127.0.0.1'
process.env.DB_PORT = '5432'
process.env.DB_NAME = 'aurora-store-test'
process.env.DB_USER = 'pguser'
process.env.DB_PASSWD = 'pguser'

test('A connection can be made to a database', async t => {
  await t.notThrowsAsync(connect().then(client => client('movies')))
})
