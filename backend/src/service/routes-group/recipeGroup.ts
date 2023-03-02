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
  private createRecipeHandler() {
    const handler: RequestHandler = async (req, res, next) => {
      console.log('create recipe');
      console.log(req.body);
      const recipe: Recipe = {recipeId: req.body.recipeId, name: req.body.name, steps: req.body.steps};
      const db_recipe = await this.recipeController.createRecipe(recipe);
      res.send(db_recipe);
    };
    return handler;
  }
}
