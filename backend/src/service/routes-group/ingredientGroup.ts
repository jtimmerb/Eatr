import {RequestHandler} from 'express';

import RoutesGroup from './routesGroup';
import IngredientController from '../../biz/ingredient-controller/ingredient-controller';

import {Ingredient} from '../../data/ingredient/entity';

export default class UserGroup extends RoutesGroup {
  private ingredientController: IngredientController;

  constructor(ingredientController: IngredientController) {
    super();
    this.ingredientController = ingredientController;
  }

  public init(): void {
    this.getRouter().post('/', this.createIngredientHandler());

    this.getRouter().get('/:ingredientId', this.getIngredientHandler());

    //this.getRouter().put('/', this.updateIngredientHandler());

    //this.getRouter().delete('/', this.deleteIngredientHandler());
  }

  private createIngredientHandler() {
    const handler: RequestHandler = async (req, res, next) => {
      const ingredient: Ingredient = {...req.body.ingredient};

      const db_ingredient = await this.ingredientController.createIngredient(ingredient);
      res.send(db_ingredient);
    };
    return handler;
  }

  private getIngredientHandler() {
    const handler: RequestHandler = async (req, res, next) => {
      const ingredientId = req.query.ingredientId;
      if (typeof ingredientId !== 'number') {
        throw Error('query parameter: IngredientId wrong type');
      }
      const ingredient = await this.ingredientController.getIngredient(ingredientId);
      res.send(ingredient);
    };
    return handler;
  }

  private updateIngredientHandler() {
    const handler: RequestHandler = async (req, res, next) => {};
    return handler;
  }

  private deleteIngredientHandler() {
    const handler: RequestHandler = async (req, res, next) => {};
    return handler;
  }
}
