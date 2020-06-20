import test from 'ava'
import { configure, default as AuroraStore } from './index'
import '../__fixtures__/initialize-env'
import path from 'path'

configure({
  migrationsFolder: path.join(__dirname, '../__fixtures__/migrations')
})

type Movie = { id: string, name: string }
const movie: Movie = { id: 'm0', name: 'star wars' }
const movieStore = AuroraStore<Movie>({ kind: 'movies' })
const rand = (max: number) => Math.floor(Math.random() * Math.floor(max))



test.serial('A value can be inserted', async t => {
  await t.notThrowsAsync(
    () => movieStore.put({ ...movie, id: `m${rand(100000)}` })
  )
})

test.serial('Failure to provide data will result in error', async t => {
  await t.throwsAsync(
    () => movieStore.put({} as Movie))
})

test.serial('A value can be put, it will be created if it does not exist', async t => {
  let result
  await t.notThrowsAsync(async () => {
    result = await movieStore.put(movie)
  })
  t.is(result.name, movie.name)
})

test.serial('A value can be put, it will ecrase previous data if already existing', async t => {
  let result
  await t.notThrowsAsync(async () => {
    result = await movieStore.put({ ...movie, name: 'V for Vendetta' })
  })
  t.is(result.name, 'V for Vendetta')
})

test.serial('A value can be retrieved', async t => {
  let result
  await t.notThrowsAsync(async () => {
    await movieStore.put(movie)
    result = await movieStore.find({ id: movie.id })
  })
  t.is(result.name, movie.name)
})

test.serial('Values can be found with filers', async t => {
  let result
  await t.notThrowsAsync(async () => {
    result = await movieStore.findAll({ name: movie.name })
  })
  t.true(result.length > 0)
})

test.serial('You may not pass filters if you wanna get everything', async t => {
  let result
  await t.notThrowsAsync(async () => {
    result = await movieStore.findAll()
  })
  t.true(result.length > 0)
})

test.serial('Values can be found with filers takinf an array', async t => {
  let result
  await t.notThrowsAsync(async () => {
    result = await movieStore.findIn('name', [movie.name, 'V for Vendetta'])
  })
  t.true(result.length > 0)
})

test.serial('A value can be deleted', async t => {
  await t.notThrowsAsync(async () => {
    await movieStore.put({ ...movie, id: 'movie2remove' })
    await movieStore.remove({ id: 'movie2remove' })
  })
  await t.throwsAsync(async () => {
    await movieStore.find({ id: 'movie2remove' })
  })
})

test.serial('You MUST use force mode to truncate a table', async t => {
  await t.throwsAsync(async () => {
    await movieStore.truncate({ force: false })
  })
})

test.serial('You can take advantage of sql specifics through the knex builder', async t => {
  let result
  await t.notThrowsAsync(async () => {
    await movieStore.put(movie)
    result = await movieStore.knexClient().then(db => 
      db('movies')
        .where({ name: movie.name })
        .count('name')
        .then(([{ count }]) => count))
  })

  t.true(result > 0)
})

// Please keep this test as the last one to clean the db --OR implement a full before/after hook system
test.serial('Using force mode, you will destroy all data in table', async t => {
  await t.notThrowsAsync(async () => {
    await movieStore.truncate({ force: true })
  })
})