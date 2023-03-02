import express from 'express';
import bodyparser from 'body-parser';

import db_conn from './data/db_conn';
import EatrService from './service/service';
import {Postgres, PORT} from './utility/config/config';

import RecipeRepo from './data/recipes/repo';
import IngredientRepo from './data/ingredient/repo';
import UserRepo from './data/users/repo';
import RecipeIngredientRepo from './data/recipe-ingredient/repo';
import UserPantryRepo from './data/user-pantry/repo';
import UserRecipeRepo from './data/user-recipe/repo';

const app = express();
const database = new db_conn(Postgres.host, Postgres.user, Postgres.password, Postgres.database, Postgres.port);
//console.log(database);

app.use(express.json());
app.use(express.urlencoded());
//app.use(bodyparser.json());

const userRepo = new UserRepo(database);
const recipeRepo = new RecipeRepo(database);
const ingredientRepo = new IngredientRepo(database);
const recipeIngredientRepo = new RecipeIngredientRepo(database);
const userPantryRepo = new UserPantryRepo(database);
const userRecipeRepo = new UserRecipeRepo(database);

const service = new EatrService(
  app,
  userRepo,
  recipeRepo,
  ingredientRepo,
  recipeIngredientRepo,
  userPantryRepo,
  userRecipeRepo,
);

service.listen(PORT);
