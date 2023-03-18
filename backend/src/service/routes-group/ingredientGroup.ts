import {RequestHandler} from 'express';
import {JSONSchemaType} from 'ajv';

import RoutesGroup from './routesGroup';
import IngredientController from '../../biz/ingredient-controller/ingredient-controller';
import ErrorHandler from '../../utility/error/errorHandler';
import {Ingredient} from '../../data/ingredient/entity';
import {createIngredientSchema, updateIngredientSchema} from '../schema/ingredient-schema';

export default class IngredientGroup extends RoutesGroup {
  private ingredientController: IngredientController;

  constructor(ingredientController: IngredientController) {
    super();
    this.ingredientController = ingredientController;
  }

  public init(): void {
    this.getRouter().post('/', this.createIngredientHandler());

    this.getRouter().get('/:ingredientId', this.getIngredientHandler());

    this.getRouter().put('/:ingredientId', this.updateIngredientHandler());

    this.getRouter().delete('/:ingredientId', this.deleteIngredientHandler());
  }

  private createIngredientHandler() {
    const handler: RequestHandler = async (req, res, next) => {
      this.validateSchema(createIngredientSchema as JSONSchemaType<any>, req.body);
      const ingredient: Ingredient = {ingredientId: 0, ...req.body.ingredient};
      const db_ingredient = await this.ingredientController.createIngredient(ingredient);
      res.send(db_ingredient);
    };
    return ErrorHandler.errorWrapper(handler);
  }

  private getIngredientHandler() {
    const handler: RequestHandler = async (req, res, next) => {
      const ingredientId = parseInt(req.params.ingredientId);
      const ingredient = await this.ingredientController.getIngredient(ingredientId);
      res.send(ingredient);
    };
    return ErrorHandler.errorWrapper(handler);
  }

  private updateIngredientHandler() {
    const handler: RequestHandler = async (req, res, next) => {
      this.validateSchema(updateIngredientSchema as JSONSchemaType<any>, req.body);
      const ingredientId = parseInt(req.params.ingredientId);
      const ingredient: Ingredient = {ingredientId: ingredientId, ...req.body.ingredient};
      await this.ingredientController.updateIngredientMacros(ingredient);
    };
    return ErrorHandler.errorWrapper(handler);
  }

  private deleteIngredientHandler() {
    const handler: RequestHandler = async (req, res, next) => {
      const ingredientId = parseInt(req.params.ingredientId);
      await this.ingredientController.deleteIngredient(ingredientId);
    };
    return ErrorHandler.errorWrapper(handler);
  }
}
