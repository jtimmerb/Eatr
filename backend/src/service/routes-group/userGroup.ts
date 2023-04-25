import {RequestHandler} from 'express';
import {JSONSchemaType} from 'ajv';

import RoutesGroup from './routesGroup';
import UserController from '../../biz/user-controller/user-controller';
import UserPantryController from '../../biz/userpantry-controller/userpantry-controller';
import UserRecipeController from '../../biz/userrecipe-controller/userrecipe-controller';
import ErrorHandler from '../../utility/error/errorHandler';
import {
  createUserSchema,
  createUserIngredientSchema,
  createUserRecipeSchema,
  updateUserIngredientSchema,
} from '../schema/user-schema';

import {User} from '../../data/users/entity';
import {Recipe} from '../../data/recipes/entity';
import {Ingredient} from '../../data/ingredient/entity';
import {UserPantry, UserPantryIngredients} from '../../data/user-pantry/entity';
import {UserRecipe, UserRecipeWithSteps} from '../../data/user-recipe/entity';
import {not} from 'ajv/dist/compile/codegen';

export default class UserGroup extends RoutesGroup {
  private userController: UserController;
  private userPantryController: UserPantryController;
  private userRecipeController: UserRecipeController;

  constructor(
    userController: UserController,
    userPantryController: UserPantryController,
    userRecipeController: UserRecipeController,
  ) {
    super();
    this.userController = userController;
    this.userPantryController = userPantryController;
    this.userRecipeController = userRecipeController;
  }

  public init(): void {
    // create user
    this.getRouter().post('/', this.createUserHandler());

    // get user
    this.getRouter().get('/:userId', this.getUserHandler());

    // list users
    this.getRouter().get('/', this.listUserHandler());

    // delete user by id
    this.getRouter().delete('/:userId', this.deleteUserHandler());

    // add recipe to user's recipe list
    this.getRouter().post('/recipes/:userId', this.addUserRecipeHandler());

    // get list of user's recipes
    this.getRouter().get('/recipes/:userId', this.getUserRecipesHandler());

    // remove a recipe from user's liked recipes
    this.getRouter().delete('/recipes/:userId/:recipeId', this.deleteUserRecipeHandler());

    // add ingredient to user's pantry
    this.getRouter().post('/:userId/ingredients', this.addUserPantryHandler());

    // get list user's pantry
    this.getRouter().get('/:userId/ingredients', this.getUserPantryHandler());

    //update user's pantry
    this.getRouter().put('/:userId/ingredients', this.updateUserPantryHandler());

    // remove item from user's pantry
    this.getRouter().delete('/:userId/ingredients/:ingredientId', this.deleteUserPantryHandler());
  }

  private createUserHandler() {
    const handler: RequestHandler = async (req, res, next) => {
      this.validateSchema(createUserSchema as JSONSchemaType<any>, req.body);
      const user = await this.userController.createUser(req.body.name);
      res.send(user);
    };
    return ErrorHandler.errorWrapper(handler);
  }

  private getUserHandler() {
    const handler: RequestHandler = async (req, res, next) => {
      const userId = parseInt(req.params.userId);
      const user = await this.userController.getUser(userId);
      res.send(user);
    };
    return ErrorHandler.errorWrapper(handler);
  }

  private listUserHandler() {
    const handler: RequestHandler = async (req, res, next) => {
      const {name} = req.query as {[key: string]: string};
      const users: User[] = await this.userController.getUsersByName(name);
      res.send(users);
    };
    return ErrorHandler.errorWrapper(handler);
  }

  private deleteUserHandler() {
    const handler: RequestHandler = async (req, res, next) => {
      const userId = parseInt(req.params.userId);
      await this.userController.deleteUser(userId);
      res.sendStatus(200);
    };
    return ErrorHandler.errorWrapper(handler);
  }

  private addUserRecipeHandler() {
    const handler: RequestHandler = async (req, res, next) => {
      this.validateSchema(createUserRecipeSchema as JSONSchemaType<any>, req.body);
      const userId = parseInt(req.params.userId);
      const userRecipe = await this.userRecipeController.createUserRecipe(userId, req.body.recipeId);
      res.send(userRecipe);
    };
    return ErrorHandler.errorWrapper(handler);
  }

  private getUserRecipesHandler() {
    const handler: RequestHandler = async (req, res, next) => {
      const userId = parseInt(req.params.userId);
      const userRecipes: UserRecipeWithSteps[] = await this.userRecipeController.getUsersLikedRecipes(userId);
      res.send(userRecipes);
    };
    return ErrorHandler.errorWrapper(handler);
  }

  private deleteUserRecipeHandler() {
    const handler: RequestHandler = async (req, res, next) => {
      const userId = parseInt(req.params.userId);
      const recipeId = parseInt(req.params.recipeId);
      await this.userRecipeController.deleteUserRecipe(userId, recipeId);
      res.sendStatus(200);
    };
    return ErrorHandler.errorWrapper(handler);
  }

  private addUserPantryHandler() {
    const handler: RequestHandler = async (req, res, next) => {
      this.validateSchema(createUserIngredientSchema as JSONSchemaType<any>, req.body);
      const userId = parseInt(req.params.userId);
      const {ingredientId, ingredientAmount} = req.body;
      const userPantry = await this.userPantryController.createUserPantry(userId, ingredientId, ingredientAmount);

      res.send(userPantry);
    };
    return ErrorHandler.errorWrapper(handler);
  }

  private getUserPantryHandler() {
    const handler: RequestHandler = async (req, res, next) => {
      const userId = parseInt(req.params.userId);
      const pantry: UserPantryIngredients[] = await this.userPantryController.getUsersPantry(userId);
      res.send(pantry);
    };
    return ErrorHandler.errorWrapper(handler);
  }

  private updateUserPantryHandler() {
    const handler: RequestHandler = async (req, res, next) => {
      this.validateSchema(updateUserIngredientSchema as JSONSchemaType<any>, req.body);
      const userId = parseInt(req.params.userId);
      const {ingredientId, ingredientAmount} = req.body;
      await this.userPantryController.deleteUserPantry(userId, ingredientId);
      const userPantry = await this.userPantryController.createUserPantry(userId, ingredientId, ingredientAmount);
      res.send(userPantry);
    };
    return ErrorHandler.errorWrapper(handler);
  }

  private deleteUserPantryHandler() {
    const handler: RequestHandler = async (req, res, next) => {
      const userId = parseInt(req.params.userId);
      const ingredientId = parseInt(req.params.ingredientId);

      await this.userPantryController.deleteUserPantry(userId, ingredientId);
      res.sendStatus(200);
    };
    return ErrorHandler.errorWrapper(handler);
  }
}
