import Knex from 'knex'

export const options:Knex.Config = {
  "connection": {
    "host": "127.0.0.1",
    "port": 5432,
    "database": "aurora-store-test",
    "user": "pguser",
    "password": "pguser"
  }
}
