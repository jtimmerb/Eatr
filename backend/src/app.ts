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

(async () => {
  const app = express();

  const localDebug = process.env.LOCAL_DEBUG;
  let pgClient: pg.Client;
  if (localDebug) {
    pgClient = new pg.Client({
      host: '',
      port: 5432,
      database: 'pgSecret.dbname',
      user: '',
      password: '',
      ssl: {rejectUnauthorized: false},
    });
  } else {
    let pgSecret: any = {};
    const pgCreds = process.env.PG_CREDENTIALS;
    if (pgCreds) {
      console.log('Reading postgres credentials from env...');
      pgSecret = JSON.parse(pgCreds);
    } else {
      const client = new SecretsManagerClient({region: process.env.AWS_DEFAULT_REGION || ''});

      const params = {
        SecretId: process.env.PG_SECRET_NAME,
      };

      console.log('Fetching secrets...');
      const command = new GetSecretValueCommand(params);
      const response = await client.send(command);

      pgSecret = JSON.parse(response.SecretString || '');
    }

    console.log('Connecting to postgres...');
    pgClient = new pg.Client({
      host: pgSecret.host,
      port: pgSecret.port,
      database: pgSecret.dbname,
      user: pgSecret.username,
      password: pgSecret.password,
      ssl: {rejectUnauthorized: false},
    });

    await pgClient.connect();
  }
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

  const port = process.env.PORT || 8080;
  await new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      console.log(`Listening on port ${port}...`);
    });
    server.on('close', () => console.log('Server closing...'));
  });
})().catch(err => {
  console.error(err);
});
