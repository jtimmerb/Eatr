import {RequestHandler} from 'express';
import {JSONSchemaType} from 'ajv';

import RoutesGroup from './routesGroup';
import RecipeController from '../../biz/recipe-controller/recipe-controller';
import RecipeIngredientController from '../../biz/recipeingredient-controller/recipeingredient-controller';
import IngredientController from '../../biz/ingredient-controller/ingredient-controller';
import {Recipe} from '../../data/recipes/entity';
import {RecipeIngredient, RecipeIngredientQuery} from '../../data/recipe-ingredient/entity';
import ErrorHandler from '../../utility/error/errorHandler';
import {CreateRecipeRequest, createRecipeSchema, updateRecipeSchema} from '../schema/recipe-schema';
import BadRequest from '../../utility/error/badRequest';

export default class RecipeGroup extends RoutesGroup {
  private recipeController: RecipeController;
  private recipeIngredientController: RecipeIngredientController;
  private ingredientController: IngredientController;

  constructor(
    recipeController: RecipeController,
    recipeIngredientController: RecipeIngredientController,
    ingredientController: IngredientController,
  ) {
    super();
    this.recipeController = recipeController;
    this.recipeIngredientController = recipeIngredientController;
    this.ingredientController = ingredientController;
  }

  public init(): void {
    // create recipe endpoint
    this.getRouter().post('/', this.createRecipeHandler());

    // get recipe by ID endpoint
    this.getRouter().get('/:recipeId', this.getRecipeHandler());

    // get random recipe endpoint
    this.getRouter().get('/', this.getRecipesHandler());

    // delete recipe endpoint
    this.getRouter().delete('/:recipeId', this.deleteRecipeHandler());

    // update recipe endpoint
    this.getRouter().put('/:recipeId', this.updateRecipeHandler());
  }

  // create recipe handler
  private createRecipeHandler() {
    const handler: RequestHandler = async (req, res, next) => {
      this.validateSchema(createRecipeSchema as JSONSchemaType<any>, req.body);

      const body = req.body as CreateRecipeRequest;
      const reqRecipe = body.recipe;
      const reqRecipeIngredients = body.recipeIngredients;

      // Get recipe
      const recipe: Recipe = {recipeId: 0, ...reqRecipe};

      // Check that ingredients exist
      for (const ing of reqRecipeIngredients) {
        if (!(await this.ingredientController.existsIngredient(ing.ingredientId)))
          throw new BadRequest(`No ingredient exists with id '${ing.ingredientId}'`);
      }

      // Create recipe
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
      const response = {recipe: db_recipe, recipeIngriedents: db_recipeIngredient};

      res.send(response);
    };
    return ErrorHandler.errorWrapper(handler);
  }

  private getRecipeHandler() {
    const handler: RequestHandler = async (req, res, next) => {
      const reqRecipeId = parseInt(req.params.recipeId);

      const recipe = await this.recipeController.getRecipe(reqRecipeId);
      const details = await this.recipeIngredientController.getRecipeDetails(recipe.recipeId);

      const response = {recipe, details};

      res.send(response);
    };
    return ErrorHandler.errorWrapper(handler);
  }

  private getRecipesHandler() {
    const handler: RequestHandler = async (req, res, next) => {
      const {ingredients} = req.query as {[key: string]: string | undefined};
      const filterIngredients = ingredients?.split(',').map(ing => parseInt(ing, 10));

      if (!filterIngredients || !ingredients)
        throw new BadRequest('must specificy a list of ingredients to filter by.');

      const recipes: Recipe[] = await this.recipeIngredientController.getRecipesByIngredients(filterIngredients);

      res.send(recipes);
    };

    return ErrorHandler.errorWrapper(handler);
  }

  private deleteRecipeHandler() {
    const handler: RequestHandler = async (req, res, next) => {
      const recipeId = parseInt(req.params.recipeId);
      await this.recipeController.deleteRecipe(recipeId);
      await this.recipeIngredientController.deleteRecipe(recipeId);
      res.sendStatus(200);
    };
    return ErrorHandler.errorWrapper(handler);
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
    return ErrorHandler.errorWrapper(handler);
  }
}
