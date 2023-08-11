import knexLib from 'knex';

const knex = knexLib({
  client: 'sqlite3',
  connection: {
    filename: './usersdb.sqlite',
  },
});

async function createTable() {
  try {
    await knex.raw('CREATE DATABASE IF NOT EXISTS usersdb.sqlite;');
    console.log('Database created successfully');

    await knex.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.string('firstName');
      table.string('lastName');
      table.string('username');
      table.string('email');
      table.timestamps(true, true);
    });

    console.log('Table "users" created successfully');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await knex.destroy();
  }
}

createTable();
