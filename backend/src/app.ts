import express from 'express';
import {SecretsManagerClient, GetSecretValueCommand} from '@aws-sdk/client-secrets-manager';
import pg from 'pg';

import EatrService from './service/service';

import RecipeRepo from './data/recipes/repo';
import IngredientRepo from './data/ingredient/repo';
import UserRepo from './data/users/repo';
import RecipeIngredientRepo from './data/recipe-ingredient/repo';
import UserPantryRepo from './data/user-pantry/repo';
import UserRecipeRepo from './data/user-recipe/repo';
import {Handler, Context, APIGatewayProxyCallback, APIGatewayEvent} from 'aws-lambda';

var appHandler: Handler<any, any> | undefined;

const init = async (): Promise<Handler<any, any>> => {
  const app = express();

  const SECRET_NAME = process.env.PG_SECRET_NAME;
  const client = new SecretsManagerClient({});

  const params = {
    SecretId: SECRET_NAME,
  };

  const command = new GetSecretValueCommand(params);
  const response = await client.send(command);

  const pgSecret = JSON.parse(response.SecretString || '');

  const pgClient = new pg.Client({
    host: pgSecret.host,
    port: pgSecret.port,
    database: pgSecret.dbname,
    user: pgSecret.username,
    password: pgSecret.password,
    ssl: true,
  });

  await pgClient.connect();
  //const database = new db_conn(pgSecret.host, pgSecret.user, pgSecret.password, pgSecret.database, pgSecret.port);
  //await database
  app.use(express.json());
  app.use(express.urlencoded());
  //app.use(bodyparser.json());

  const userRepo = new UserRepo(pgClient);
  const recipeRepo = new RecipeRepo(pgClient);
  const ingredientRepo = new IngredientRepo(pgClient);
  const recipeIngredientRepo = new RecipeIngredientRepo(pgClient);
  const userPantryRepo = new UserPantryRepo(pgClient);
  const userRecipeRepo = new UserRecipeRepo(pgClient);

  const service = new EatrService(
    app,
    userRepo,
    recipeRepo,
    ingredientRepo,
    recipeIngredientRepo,
    userPantryRepo,
    userRecipeRepo,
  );

  return service.getHandler();
};

export const handler = async (
  event: APIGatewayEvent,
  context: Context,
  callback: APIGatewayProxyCallback,
): Promise<void> => {
  if (appHandler === undefined) {
    appHandler = await init();
  }
  await appHandler(event, context, callback);
};
