/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = (knex) =>
  knex.schema.createTable('tasks-to-labels', (table) => {
    table.increments('id').primary();
    table.integer('task_id')
      .references('tasks.id');
    table.integer('label_id')
      .references('labels.id');
  });

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = (knex) =>
  knex.schema.dropTable('tasks-to-labels');
