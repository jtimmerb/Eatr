import {Application} from 'express';
import serverlessExpress from '@vendia/serverless-express';
import {Handler} from 'aws-lambda';

import IngredientController from '../biz/ingredient-controller/ingredient-controller';
import UserController from '../biz/user-controller/user-controller';
import RecipeController from '../biz/recipe-controller/recipe-controller';
import RecipeIngredientController from '../biz/recipeingredient-controller/recipeingredient-controller';
import UserPantryController from '../biz/userpantry-controller/userpantry-controller';
import UserRecipeController from '../biz/userrecipe-controller/userrecipe-controller';

import IngredientRepo from '../data/ingredient/repo';
import UserRepo from '../data/users/repo';
import RecipeRepo from '../data/recipes/repo';
import RecipeIngredientRepo from '../data/recipe-ingredient/repo';
import UserPantryRepo from '../data/user-pantry/repo';
import UserRecipeRepo from '../data/user-recipe/repo';

import RecipeGroup from './routes-group/recipeGroup';
import UserGroup from './routes-group/userGroup';
import IngredientGroup from './routes-group/ingredientGroup';

import ErrorHandler from '../utility/error/errorHandler';

import {API_VERSION} from '../utility/config/config';

interface Service {
  listen(port: number): void;
}

export default class EatrService implements Service {
  private app: Application;

  public userController: UserController;
  public recipeController: RecipeController;
  public ingredientController: IngredientController;
  public recipeIngredientController: RecipeIngredientController;
  public userPantryController: UserPantryController;
  public userRecipeController: UserRecipeController;

  constructor(
    app: Application,
    userRepo: UserRepo,
    recipeRepo: RecipeRepo,
    ingredientRepo: IngredientRepo,
    recipeIngredientRepo: RecipeIngredientRepo,
    userPantryRepo: UserPantryRepo,
    userRecipeRepo: UserRecipeRepo,
  ) {
    this.app = app;
    this.userController = new UserController(userRepo);
    this.recipeController = new RecipeController(recipeRepo);
    this.ingredientController = new IngredientController(ingredientRepo);
    this.recipeIngredientController = new RecipeIngredientController(
      recipeIngredientRepo,
      this.recipeController,
      this.ingredientController,
    );
    this.userPantryController = new UserPantryController(
      userPantryRepo,
      this.ingredientController,
      this.userController,
    );
    this.userRecipeController = new UserRecipeController(userRecipeRepo, this.recipeController, this.userController);
    this.initRoutes();
  }

  public getHandler(): Handler<any, any> {
    return serverlessExpress({app: this.app});
  }

  public listen(port: number): void {
    this.app.listen(port, () => console.log('Server running'));
  }

  private initRoutes() {
    // Health check routes
    this.app.get('/', (_, res) => res.end());
    this.app.get(API_VERSION, (_, res) => res.end());

    const recipeGroup = new RecipeGroup(this.recipeController, this.recipeIngredientController);
    recipeGroup.mount(API_VERSION + '/recipes', this.app);

    const userGroup = new UserGroup(this.userController, this.userPantryController, this.userRecipeController);
    userGroup.mount(API_VERSION + '/users', this.app);

    const ingredientGroup = new IngredientGroup(this.ingredientController);
    ingredientGroup.mount(API_VERSION + '/ingredients', this.app);

    this.app.use(ErrorHandler.errorHandler);
  }
}
