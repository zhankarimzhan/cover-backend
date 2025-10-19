/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.raw(`
    create table hr.user (

	id serial primary key,
	username varchar(255),
	password varchar(255),
	uuid varchar(255)
)

    `)
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.raw (`
    drop table hr.user
    `)
};
