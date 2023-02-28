BEGIN;

SET client_encoding = 'LATIN1';

CREATE SEQUENCE recipes_recipe_id_seq 
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1
;

CREATE SEQUENCE users_user_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1
;

CREATE SEQUENCE ingredients_ingredient_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1
;

CREATE SEQUENCE recipe_ingredients_membership_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1
;

CREATE SEQUENCE up_membership_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1
;

CREATE SEQUENCE user_recipes_membership_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1
;

CREATE TABLE recipes
(
    recipe_id integer NOT NULL DEFAULT nextval('recipes_recipe_id_seq'::regclass),
    name text COLLATE pg_catalog."default" NOT NULL,
    steps json,
    CONSTRAINT recipe_pkey PRIMARY KEY (recipe_id)
);


CREATE TABLE users
(
    user_id integer NOT NULL DEFAULT nextval('users_user_id_seq'::regclass),
    name text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (user_id)
);

CREATE TABLE ingredients
(
    ingredient_id integer NOT NULL DEFAULT nextval('ingredients_ingredient_id_seq'::regclass),
    name text COLLATE pg_catalog."default" NOT NULL,
    serving_size text NOT NULL, 
    calories integer NOT NULL,
    proteins integer NOT NULL,
    carbohydrates integer NOT NULL,
    fats integer NOT NULL,
    CONSTRAINT ingredient_pkey PRIMARY KEY (ingredientId)
);

CREATE TABLE recipe_ingredients
(
    recipe_ingredient_membership_id integer NOT NULL DEFAULT nextval('recipe_ingredients_membership_id_seq'::regclass),
    recipe_id integer NOT NULL,
    ingredient_id integer NOT NULL,
    ingredient_amount text NOT NULL
);

CREATE TABLE user_recipes
(
    user_recipe_membership_id integer NOT NULL DEFAULT nextval('user_recipes_membership_id_seq'::regclass),
    user_id integer NOT NULL,
    recipe_id integer NOT NULL
);

CREATE TABLE user_pantries
(
    up_membership_id integer NOT NULL DEFAULT nextval('up_membership_id_seq'::regclass),
    user_id integer NOT NULL,
    ingredient_id integer NOT NULL,
    ingredient_amount text NOT NULL
);

COMMIT;