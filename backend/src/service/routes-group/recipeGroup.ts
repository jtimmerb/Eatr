import {RequestHandler} from 'express';

import RoutesGroup from './routesGroup';
import RecipeController from '../../biz/recipe-controller/recipe-controller';
import {Recipe} from '../../data/recipes/entity';

export default class RecipeGroup extends RoutesGroup {
  private recipeController: RecipeController;

  constructor(recipeController: RecipeController) {
    super();
    this.recipeController = recipeController;
  }

  public init(): void {
    // create recipe endpoint
    this.getRouter().post('/', this.createRecipeHandler);

    // get random recipe endpoint
    this.getRouter().get('/');

    // get recipe by ID endpoint
    this.getRouter().get('/:recipeID');

    // delete recipe endpoint
    this.getRouter().delete('/:recipeID');

    // update recipe endpoint
    this.getRouter().put('/:recipeID');
  }

  private getRandomRecipeHandler() {
    const handler: RequestHandler = async (req, res, next) => {
      return;
    };
  }

  private createRecipeHandler() {
    const handler: RequestHandler = async (req, res, next) => {
      const recipe: Recipe = {...req.body};
      const db_recipe = await this.recipeController.createRecipe(recipe);
      res.send(db_recipe);
    };
  }
}
