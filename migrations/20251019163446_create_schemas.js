/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.raw(`
    CREATE SCHEMA IF NOT EXISTS hr;
    CREATE SCHEMA IF NOT EXISTS app;
    CREATE SCHEMA IF NOT EXISTS ref;
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.raw(`
    DROP SCHEMA IF EXISTS hr CASCADE;
    DROP SCHEMA IF EXISTS app CASCADE;
    DROP SCHEMA IF EXISTS ref CASCADE;
  `);
};
