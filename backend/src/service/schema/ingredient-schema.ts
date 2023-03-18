import {JSONSchemaType} from 'ajv';

interface CreateIngredient {
  name: string;
  servingSize: string;
  calories: number;
  proteins: number;
  carbohydrates: number;
  fats: number;
}

export const createIngredientSchema: JSONSchemaType<CreateIngredient> = {
  type: 'object',
  properties: {
    name: {type: 'string'},
    servingSize: {type: 'string'},
    calories: {type: 'number'},
    proteins: {type: 'number'},
    carbohydrates: {type: 'number'},
    fats: {type: 'number'},
  },
  required: ['name', 'servingSize', 'calories', 'proteins', 'carbohydrates', 'fats'],
};

interface UpdateIngredient extends CreateIngredient {}

export const updateIngredientSchema: JSONSchemaType<UpdateIngredient> = {
  type: 'object',
  properties: {
    name: {type: 'string'},
    servingSize: {type: 'string'},
    calories: {type: 'number'},
    proteins: {type: 'number'},
    carbohydrates: {type: 'number'},
    fats: {type: 'number'},
  },
  required: ['name', 'servingSize', 'calories', 'proteins', 'carbohydrates', 'fats'],
};
