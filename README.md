## Goal
This repo was originaly made to provide a serverless aurora postgresql connector to be used in Keyro Login with a strong retro-compatibility with our [dynamodb connector](https://github.com/nutshell-lab/dynamodb-table) in mind.
By implementing the same API, it offers the opportunity to easily switch between Aurora and Dynamo.

## Usage

### Installation
```bash
yarn add @nutshelllab/aurora-store
```
This module allows you to run your code on a local database. To do so, you will also need to have a proper
postgresql installation running.

## Configuration

Config is done through env variables so that you can use your serverless environnement to handle it as code :

### Access to the database

Variable | description
---------|------------
DB_HOST | The ip adress/domain where the SGBD runs. It may be an aws aurora cluster.
DB_PORT | Default is postgres's default (5432)
DB_NAME | The name of your postgresql database
DB_USER | Username who has been given the proper privileges in your db
DB_PASSWD | Password of the above user
SLS_STAGE | **If `local` is passed, the variables below will be used instead of above.**
LOCAL_DB_HOST | The ip adress/domain where the SGBD runs. It may be 127.0.0.1.
LOCAL_DB_PORT | Default is postgres's default (5432)
LOCAL_DB_NAME | The name of your postgresql database
LOCAL_DB_USER | Username who has been given the proper privileges in your db
LOCAL_DB_PASSWD | Password of the above user

### Migrations
You can easily configure a migration source to handle your database schema. Migration are internally done through Knex, so that the configuration is identical. Here's an example with webpack context :

```js
import { configure } from '@nutshelllab/aurora-store' //The module expose a simple configure method

const context = require.context('../../migrations', false, /\.js$/)

const makeMigrationSource = context => {
  return {
    getMigrations() {
      return Promise.resolve(context.keys().sort())
    },
    getMigrationName(migration) {
      return migration
    },
    getMigration(migration) {
      return context(migration)
    }
  }
}

configure({
  migrationSource: makeMigrationSource(context) // Configuration is mutating the state, keep it for initialization as much as possible.
})
```

### Initialize a store
To initialize a store, just call default function of the module :

```js
import createStore from '@nutshelllab/aurora-store'

//[...] configuration has been done at this point

const teamStore = createStore({ kind: 'teams', validate: makeTeam })
const result = await teamStore.find({ id: 'team-00007'})
```

Options you can pass to the default store builder function are :

Option | description | default
---------|------------|-------
kind | The table name you want to manipulate | No default, must be set
validate | A validator function to be called on data before writing and after reading | [id function](https://en.wikipedia.org/wiki/Identity_function) (nothing happen)
idField | Handle PK with this option as an array of columns names | ['id']


### Features
* [findIn](https://github.com/nutshell-lab/aurora-store#findIn)
* [findAll](https://github.com/nutshell-lab/aurora-store#findAll)
* [find](https://github.com/nutshell-lab/aurora-store#find)
* [put](https://github.com/nutshell-lab/aurora-store#put)
* [update](https://github.com/nutshell-lab/aurora-store#update)
* [create](https://github.com/nutshell-lab/aurora-store#create)
* [findOrCreate](https://github.com/nutshell-lab/aurora-store#findOrCreate)
* [remove](https://github.com/nutshell-lab/aurora-store#remove)
* [truncate](https://github.com/nutshell-lab/aurora-store#truncate)
* [knexClient](https://github.com/nutshell-lab/aurora-store#knexClient)

#### findIn(field, values)

Returns all the records having a field's value intercecting with a predefined array of value.

```js
store.findIn('id', ['001', '002', '003'])
```

#### findAll(filters)

Returns all the records matching a pattern

```js
store.findAll({ contracted: true })
```

#### find(filters)
Returns exactly one record matching a pattern or throw an error with name attribute set to 'NOT_FOUND'.

```js
store.find({ id: '001' })
```

#### put(data)
Write an object with the store. If it does not exist, it will be created.

```js
store.put({ id: 'movie-0001', name: 'Black Widow' })
```

#### update(data)
Update the record matching with data id (default is 'id' field, see idField configuration to change it).

```js
store.update({id: 'movie-0001', name: 'Black Windows' })
```

#### create(data)
Insert a new record with the given object values. AlreadyExisting will throw.

```js
store.create({id: 'movie-0002', name: 'Black Windows' })
```

#### findOrCreate(filters, data)
Fetch a record with filters. A creation attempt is made it nothing is found. Bad filtering may result in throwing already exist error.

```js
store.create({name: 'Black Windows'}, { id: 'newId-002', name: 'Black Windows', company: 'marvelcrosoft'})
```

#### remove(filters)
Destroy all records with filters forever.

```js
store.remove({name: 'Black Windows'})
```

#### truncate
Destroy all records of a table forever. You must pass force attribute to true to execute this as a way to make it
clear that you know what you're doing.

```js
store.truncate() // won't work
store.truncate({ force: true })
```

#### knexClient
Obviously the point of using a relational database was to go beyond dynamo key-values restriction. This function gives you a Knex querybuilder. You can use that to manipulate any table in a sql-query manner :

```js
store.knexClient().then(db =>
  db('movies').innerjoin('authors', 'authors.id', 'movies.authorId').where('authors.name', 'marvelcrosoft').select('movies.*')
)
```

See [knex documentation](https://knexjs.org/) for further features.


### Combine with [serverless-offline](https://github.com/dherault/serverless-offline)
With serverless-offline, this module can be used to provide a 100% local execution which may **greatly** increase your productivity. Keyro Login has been tested and successfully run on a localhost with a local duplicated database of our remote dev environement.

## Contribute

1. Install postgresql
2. Create a `pguser` user with a `pguser` password
3. `yarn`
4. Check integration tests `yarn test`
