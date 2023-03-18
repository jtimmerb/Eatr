import {JSONSchemaType} from 'ajv';

// create user interface
interface CreateUser {
  name: string;
}

/** Create user schema */
export const createUserSchema: JSONSchemaType<CreateUser> = {
  type: 'object',
  properties: {
    name: {type: 'string'},
  },
  required: ['name'],
};

interface CreateUserRecipe {
  recipeId: number;
}

export const createUserRecipeSchema: JSONSchemaType<CreateUserRecipe> = {
  type: 'object',
  properties: {
    recipeId: {type: 'number'},
  },
  required: ['recipeId'],
};

interface CreateUserIngredient {
  ingredientId: number;
  ingredientAmount: string;
}

export const createUserIngredientSchema: JSONSchemaType<CreateUserIngredient> = {
  type: 'object',
  properties: {
    ingredientId: {type: 'number'},
    ingredientAmount: {type: 'string'},
  },
  required: ['ingredientId', 'ingredientAmount'],
};
