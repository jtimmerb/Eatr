import {Application} from 'express';
import UserRepo from '../data/users/repo';
import RecipeRepo from '../data/recipes/repo';
import db_conn from '../data/db_conn';
import IngredientRepo from '../data/ingredient/repo';
import RecipeIngredientRepo from '../data/recipe-ingredient/repo';
import UserPantryRepo from '../data/user-pantry/repo';
import UserRecipeRepo from '../data/user-recipe/repo';

interface Service {
  listen(port: number): void;
}

export default class EatrService implements Service {
  private app: Application;
  public userRepo: UserRepo;
  public recipeRepo: RecipeRepo;
  public ingredientRepo: IngredientRepo;
  public recipeIngredientRepo: RecipeIngredientRepo;
  public userPantryRepo: UserPantryRepo;
  public userRecipeRepo: UserRecipeRepo;

  constructor(app: Application, psql: db_conn) {
    this.app = app;
    this.userRepo = new UserRepo(psql);
    this.recipeRepo = new RecipeRepo(psql);
    this.ingredientRepo = new IngredientRepo(psql);
    this.recipeIngredientRepo = new RecipeIngredientRepo(psql);
    this.userPantryRepo = new UserPantryRepo(psql);
    this.userRecipeRepo = new UserRecipeRepo(psql);
  }

  public listen(port: number): void {
    this.app.listen(port, () => console.log('Server running'));
  }
}
