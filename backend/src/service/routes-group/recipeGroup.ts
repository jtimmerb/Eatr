import {RequestHandler} from 'express';

import RoutesGroup from './routesGroup';
import RecipeController from '../../biz/recipe-controller/recipe-controller';
import RecipeIngredientController from '../../biz/recipeingredientcontroller/recipeingredient-controller';
import {Recipe} from '../../data/recipes/entity';
import {RecipeIngredient, RecipeIngredientQuery} from '../../data/recipe-ingredient/entity';

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
      const reqRecipe = req.body.recipe;
      const reqRecipeIngredient = req.body.recipeIngredients;

      // Get recipe
      const recipe: Recipe = {...reqRecipe};

      // Get recipe's ingredient
      const recipeIngredientKeys = Object.keys(reqRecipeIngredient);

      const recipeIngredientArray: RecipeIngredient[] = recipeIngredientKeys.map(key => {
        // Extract the recipeIngredient properties
        const {recipeID, ingredientId, amount} = reqRecipeIngredient[key];

        // Create a new RecipeIngredient object
        const recipeIngredient: RecipeIngredient = {
          recipeIngredientMembershipId: 0,
          recipeId: recipeID,
          ingredientId: ingredientId,
          ingredientAmount: amount,
        };

        return recipeIngredient;
      });

      const db_recipe = await this.recipeController.createRecipe(recipe);
      const db_recipeIngredient = await this.recipeIngredientController.createRecipeIngredient(recipeIngredientArray);
      const response = {db_recipe, db_recipeIngredient};

      res.send(response);
    };
    return handler;
  }

  private getRecipeHandler() {
    const handler: RequestHandler = async (req, res, next) => {
      const reqRecipeID = req.body.recipeId;

      const recipe: Recipe = {
        recipeId: reqRecipeID,
        name: '',
        steps: [],
      };

      const db_recipe = await this.recipeController.getRecipe(reqRecipeID);
      const db_recipeIngredient = await this.recipeIngredientController.getRecipeIngredient(reqRecipeID);

      const response = {db_recipe, db_recipeIngredient};

      res.send(response);
    };
    return handler;
  }

  private getRandomRecipesHandler() {
    const handler: RequestHandler = async (req, res, next) => {
      const filterIngredients = req.body.filterIngredients;

      const recipeAndIngredients: RecipeIngredientQuery[] = await this.recipeIngredientController.getFiveRandomRecipes(
        filterIngredients,
      );

      res.send(recipeAndIngredients);
    };

    return handler;
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
        const {recipeID, ingredientId, amount} = newRecipeIngredients[key];

        // Create a new RecipeIngredient object
        const recipeIngredient: RecipeIngredient = {
          recipeIngredientMembershipId: 0,
          recipeId: recipeID,
          ingredientId: ingredientId,
          ingredientAmount: amount,
        };

        return recipeIngredient;
      });

      await this.recipeController.updateRecipe(recipe);
      await this.recipeIngredientController.updateRecipe(recipeIngredientArray);

      const response = {newRecipe, newRecipeIngredients};
      res.send(response);
    };
    return handler;
  }
}
