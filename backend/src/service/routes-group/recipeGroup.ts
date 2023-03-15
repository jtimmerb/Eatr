import {RequestHandler} from 'express';
import {JSONSchemaType} from 'ajv';

import RoutesGroup from './routesGroup';
import RecipeController from '../../biz/recipe-controller/recipe-controller';
import RecipeIngredientController from '../../biz/recipeingredient-controller/recipeingredient-controller';
import {Recipe} from '../../data/recipes/entity';
import {RecipeIngredient, RecipeIngredientQuery} from '../../data/recipe-ingredient/entity';
import ErrorHandler from '../../utility/error/errorHandler';
import {createRecipeSchema, updateRecipeSchema} from '../schema/recipe-schema';

export default class RecipeGroup extends RoutesGroup {
  private recipeController: RecipeController;
  private recipeIngredientController: RecipeIngredientController;

  constructor(recipeController: RecipeController, recipeIngredientController: RecipeIngredientController) {
    super();
    this.recipeController = recipeController;
    this.recipeIngredientController = recipeIngredientController;
  }

  public init(): void {
    // create recipe endpoint
    this.getRouter().post('/', this.createRecipeHandler());

    // get recipe by ID endpoint
    this.getRouter().get('/:recipeID', this.getRecipeHandler());

    // get random recipe endpoint
    this.getRouter().get('/', this.getRandomRecipesHandler());

    // delete recipe endpoint
    this.getRouter().delete('/:recipeID', this.deleteRecipeHandler());

    // update recipe endpoint
    this.getRouter().put('/:recipeID', this.updateRecipeHandler());
  }

  // create recipe handler
  private createRecipeHandler() {
    const handler: RequestHandler = async (req, res, next) => {
      this.validateSchema(createRecipeSchema as JSONSchemaType<any>, req.body);

      const reqRecipe = req.body.recipe;
      const reqRecipeIngredients = req.body.recipeIngredients;

      // Get recipe
      const recipe: Recipe = {...reqRecipe};

      const db_recipe = await this.recipeController.createRecipe(recipe);

      const recipeIngredientArray: RecipeIngredient[] = reqRecipeIngredients.map(
        (recipeIngredient: RecipeIngredient) => {
          const {recipeId, ingredientId, ingredientAmount} = recipeIngredient;

          const newRecipeIngredient: RecipeIngredient = {
            recipeIngredientMembershipId: 0,
            recipeId: db_recipe.recipeId,
            ingredientId: ingredientId,
            ingredientAmount: ingredientAmount,
          };

          return newRecipeIngredient;
        },
      );

      const db_recipeIngredient = await this.recipeIngredientController.createRecipeIngredient(recipeIngredientArray);
      const response = {db_recipe, db_recipeIngredient};

      res.send(response);
    };
    return ErrorHandler.errorWrapper(handler);
  }

  private getRecipeHandler() {
    const handler: RequestHandler = async (req, res, next) => {
      const reqRecipeId = req.body.recipeId;

      const db_recipe = await this.recipeController.getRecipe(reqRecipeId);
      const db_recipeIngredient = await this.recipeIngredientController.getRecipeIngredient(db_recipe.recipeId);

      const response = {db_recipe, db_recipeIngredient};

      res.send(response);
    };
    return ErrorHandler.errorWrapper(handler);
  }

  private getRandomRecipesHandler() {
    const handler: RequestHandler = async (req, res, next) => {
      const filterIngredients = req.body.filterIngredients;

      const recipes: Recipe[] = await this.recipeIngredientController.getFiveRandomRecipes(filterIngredients);

      res.send(recipes);
    };

    return ErrorHandler.errorWrapper(handler);
  }

  private deleteRecipeHandler() {
    const handler: RequestHandler = async (req, res, next) => {
      const recipeId = req.body.recipeId;
      await this.recipeController.deleteRecipe(recipeId);
      await this.recipeIngredientController.deleteRecipe(recipeId);
    };
    return handler;
  }

  private updateRecipeHandler() {
    const handler: RequestHandler = async (req, res, next) => {
      const newRecipe = req.body.recipe;
      const newRecipeIngredients = req.body.recipeIngredients;

      // create new Recipe object
      const recipe: Recipe = {...newRecipe};

      // create new recipeIngredient array
      const recipeIngredientKeys = Object.keys(newRecipeIngredients);

      const recipeIngredientArray: RecipeIngredient[] = recipeIngredientKeys.map(key => {
        // Extract the recipeIngredient properties
        console.log(newRecipeIngredients[key]);
        const {recipeId, ingredientId, ingredientAmount} = newRecipeIngredients[key];

        // Create a new RecipeIngredient object
        const recipeIngredient: RecipeIngredient = {
          recipeIngredientMembershipId: 0,
          recipeId: recipeId,
          ingredientId: ingredientId,
          ingredientAmount: ingredientAmount,
        };

        return recipeIngredient;
      });

      await this.recipeController.updateRecipe(recipe);
      await this.recipeIngredientController.updateRecipe(recipeIngredientArray);

      const response = {newRecipe, newRecipeIngredients};
      res.send(response);
    };
    return ErrorHandler.errorWrapper(handler);
  }
}
