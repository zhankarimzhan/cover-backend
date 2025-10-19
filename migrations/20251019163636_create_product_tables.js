exports.up = function (knex) {
  return knex.raw(`

CREATE TABLE hr."user" (
  id serial PRIMARY KEY,
  username varchar(255),
  password varchar(255),
  uuid varchar(255)
);

CREATE TABLE ref.product_type (
  id serial PRIMARY KEY,
  name varchar(255)
);

CREATE TABLE app.product_card (
  id serial PRIMARY KEY,
  name varchar(255),
  description text,
  create_date timestamp DEFAULT current_timestamp,
  update_date timestamp NULL,
  create_user_id int REFERENCES hr."user"(id),
  product_type_id int REFERENCES ref.product_type(id),
  current_price int
);

CREATE TABLE app.product_price_history (
  id serial PRIMARY KEY,
  price int,
  user_id int REFERENCES hr."user"(id),
  create_date timestamp DEFAULT current_timestamp,
  product_card_id int REFERENCES app.product_card(id)
);

CREATE TABLE app.product_card_viewer (
  id serial PRIMARY KEY,
  user_id int REFERENCES hr."user"(id),
  create_date timestamp DEFAULT current_timestamp,
  liked boolean DEFAULT false,
  product_card_id int REFERENCES app.product_card(id)
);

CREATE TABLE app.product_card_comment (
  id serial PRIMARY KEY,
  user_id int REFERENCES hr."user"(id),
  create_date timestamp DEFAULT current_timestamp,
  parent_id int REFERENCES app.product_card_comment(id),
  product_card_id int REFERENCES app.product_card(id),
  message text
);

CREATE TABLE app.comment_action (
  id serial PRIMARY KEY,
  user_id int REFERENCES hr."user"(id),
  create_date timestamp DEFAULT current_timestamp,
  comment_id int REFERENCES app.product_card_comment(id),
  is_liked boolean DEFAULT false
);

CREATE TABLE ref.file_type (
  id serial PRIMARY KEY,
  name varchar(1024),
  bucket_name varchar(255),
  file_uuid varchar(255)
);

CREATE TABLE app.file (
  id serial PRIMARY KEY,
  name varchar(1024),
  file_type_id int REFERENCES ref.file_type(id),
  deleted_at timestamp NULL
);

CREATE TABLE app.object_file (
  id serial PRIMARY KEY,
  object_id int,
  file_id int REFERENCES app.file(id),
  deleted_at timestamp NULL
);

  `);
};

exports.down = function (knex) {
  return knex.raw(`
    DROP TABLE IF EXISTS app.object_file CASCADE;
    DROP TABLE IF EXISTS app.file CASCADE;
    DROP TABLE IF EXISTS ref.file_type CASCADE;
    DROP TABLE IF EXISTS app.comment_action CASCADE;
    DROP TABLE IF EXISTS app.product_card_comment CASCADE;
    DROP TABLE IF EXISTS app.product_card_viewer CASCADE;
    DROP TABLE IF EXISTS app.product_price_history CASCADE;
    DROP TABLE IF EXISTS app.product_card CASCADE;
    DROP TABLE IF EXISTS ref.product_type CASCADE;
    DROP TABLE IF EXISTS hr."user" CASCADE;
  `);
};
