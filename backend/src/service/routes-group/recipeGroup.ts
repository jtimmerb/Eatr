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
    this.getRouter().get('/:recipeId', this.getRecipeHandler());

    // get random recipe endpoint
    this.getRouter().get('/', this.getRandomRecipesHandler());

    // delete recipe endpoint
    this.getRouter().delete('/:recipeId', this.deleteRecipeHandler());

    // update recipe endpoint
    this.getRouter().put('/:recipeId', this.updateRecipeHandler());
  }

  // create recipe handler
  private createRecipeHandler() {
    const handler: RequestHandler = async (req, res, next) => {
      this.validateSchema(createRecipeSchema as JSONSchemaType<any>, req.body);

      const reqRecipe = req.body.recipe;
      const reqRecipeIngredients = req.body.recipeIngredients;

      // Get recipe
      const recipe: Recipe = {recipeId: 0, ...reqRecipe};

      const db_recipe = await this.recipeController.createRecipe(recipe);

      const recipeIngredientArray: RecipeIngredient[] = reqRecipeIngredients.map(
        (recipeIngredient: RecipeIngredient) => {
          const {recipeIngredientMembershipId, recipeId, ingredientId, ingredientAmount} = recipeIngredient;

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
    return handler;
  }

  private getRecipeHandler() {
    const handler: RequestHandler = async (req, res, next) => {
      const reqRecipeId = parseInt(req.params.recipeId);

      const db_recipe = await this.recipeController.getRecipe(reqRecipeId);
      const db_recipeIngredients = await this.recipeIngredientController.getRecipeIngredient(db_recipe.recipeId);

      const response = {db_recipe, db_recipeIngredients};

      res.send(response);
    };
    return handler;
  }

  private getRandomRecipesHandler() {
    const handler: RequestHandler = async (req, res, next) => {
      const filterIngredients = req.body.filterIngredients;

      const recipes: Recipe[] = await this.recipeIngredientController.getFiveRandomRecipes(filterIngredients);

      res.send(recipes);
    };

    return handler;
  }

  private deleteRecipeHandler() {
    const handler: RequestHandler = async (req, res, next) => {
      const recipeId = parseInt(req.params.recipeId);
      await this.recipeController.deleteRecipe(recipeId);
      await this.recipeIngredientController.deleteRecipe(recipeId);
      res.sendStatus(200);
    };
    return handler;
  }

  private updateRecipeHandler() {
    const handler: RequestHandler = async (req, res, next) => {
      this.validateSchema(updateRecipeSchema as JSONSchemaType<any>, req.body);

      const currentRecipeId = parseInt(req.params.recipeId);
      const newRecipe = req.body.recipe;
      const newRecipeIngredients = req.body.recipeIngredients;

      const recipe: Recipe = {recipeId: currentRecipeId, ...newRecipe};
      await this.recipeController.updateRecipe(recipe);

      const recipeIngredientArray: RecipeIngredient[] = newRecipeIngredients.map(
        (recipeIngredient: RecipeIngredient) => {
          const {recipeIngredientMembershipId, recipeId, ingredientId, ingredientAmount} = recipeIngredient;

          const newRecipeIngredient: RecipeIngredient = {
            recipeIngredientMembershipId: recipeIngredientMembershipId,
            recipeId: currentRecipeId,
            ingredientId: ingredientId,
            ingredientAmount: ingredientAmount,
          };

          return newRecipeIngredient;
        },
      );

      await this.recipeIngredientController.updateRecipe(recipeIngredientArray);
      res.sendStatus(200);
    };
    return handler;
  }
}
