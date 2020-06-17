function up(knex) {
  console.log(`database - migration - ${up.name} - ${__filename}`)
  return knex.schema.createTable('movies', table => {
    table.string('id').primary()
    table.string('name').notNullable()
  })
}

function down(knex) {
  console.log(`database - migration - ${down.name} - ${__filename}`)
  return knex.schema.dropTable('movies')
}

module.exports = { up, down }
