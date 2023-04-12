import PG from 'pg';
import {Context, APIGatewayProxyCallback, APIGatewayEvent} from 'aws-lambda';
import {SecretsManagerClient, GetSecretValueCommand} from '@aws-sdk/client-secrets-manager';

const eatrCommands = `
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
    CONSTRAINT ingredient_pkey PRIMARY KEY (ingredient_id)
);

CREATE TABLE recipe_ingredients
(
    recipe_ingredient_membership_id integer NOT NULL DEFAULT nextval('recipe_ingredients_membership_id_seq'::regclass),
    recipe_id integer NOT NULL,
    ingredient_id integer NOT NULL,
    ingredient_amount text NOT NULL,
    CONSTRAINT recipe_ingredient_pkey PRIMARY KEY (recipe_ingredient_membership_id)
);

CREATE TABLE user_recipes
(
    user_recipe_membership_id integer NOT NULL DEFAULT nextval('user_recipes_membership_id_seq'::regclass),
    user_id integer NOT NULL,
    recipe_id integer NOT NULL,
    CONSTRAINT user_recipe_pkey PRIMARY KEY (user_recipe_membership_id)
);

CREATE TABLE user_pantries
(
    up_membership_id integer NOT NULL DEFAULT nextval('up_membership_id_seq'::regclass),
    user_id integer NOT NULL,
    ingredient_id integer NOT NULL,
    ingredient_amount text NOT NULL,
    CONSTRAINT user_pantry_pkey PRIMARY KEY (up_membership_id)
);

COMMIT;`;

const SECRET_NAME = process.env.PG_SECRET_NAME;

export const lambdaTableHandler = async (
  event: APIGatewayEvent,
  context: Context,
  callback: APIGatewayProxyCallback,
): Promise<void> => {
  // a client can be shared by different commands.
  const client = new SecretsManagerClient({});

  const params = {
    SecretId: SECRET_NAME,
  };
  const command = new GetSecretValueCommand(params);
  const response = await client.send(command);

  const pgSecret = JSON.parse(response.SecretString || '');

  //console.log(pgSecret);

  const pgClient = new PG.Client({
    host: pgSecret.host,
    port: pgSecret.port,
    database: pgSecret.dbname,
    user: pgSecret.username,
    password: pgSecret.password,
    ssl: true,
  });

  await pgClient.connect();

  const res = await pgClient.query(eatrCommands);
  console.log(res);
  pgClient.end();
};
