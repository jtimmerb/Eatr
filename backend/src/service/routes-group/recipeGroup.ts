import {RequestHandler} from 'express';

import RoutesGroup from './routesGroup';
import RecipeController from '../../biz/recipe-controller/recipe-controller';
import RecipeIngredientController from '../../biz/recipeingredientcontroller/recipeingredient-controller';
import {Recipe} from '../../data/recipes/entity';
import {RecipeIngredient} from '../../data/recipe-ingredient/entity';

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

    // get random recipe endpoint
    this.getRouter().get('/', this.getRandomRecipeHandler());

    // get recipe by ID endpoint
    this.getRouter().get('/:recipeID', this.getRecipeHandler());

    // delete recipe endpoint
    this.getRouter().delete('/:recipeID');

    // update recipe endpoint
    this.getRouter().put('/:recipeID');
  }

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

  private getRandomRecipeHandler() {
    const handler: RequestHandler = async (req, res, next) => {
      res.send('get random recipe handler');
      return;
    };

    return handler;
  }

  private getRecipeHandler() {
    const handler: RequestHandler = async (req, res, next) => {
      res.send('get recipe handler');
      return;
    };
    return handler;
  }
}
