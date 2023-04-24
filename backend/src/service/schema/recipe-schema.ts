import {JSONSchemaType} from 'ajv';
import {RecipeIngredient} from '../../data/recipe-ingredient/entity';

interface CreateRecipe {
  recipe: {name: string; steps: string[]; image: string};
  recipeIngredients: RecipeIngredient[];
}

/** Create recipe schema */
export const createRecipeSchema: JSONSchemaType<CreateRecipe> = {
  type: 'object',
  properties: {
    recipe: {
      type: 'object',
      properties: {name: {type: 'string'}, steps: {type: 'array', minItems: 1, items: {type: 'string'}}, image: {type: 'string'}},
      required: ['name', 'steps', 'image'],
    },
    recipeIngredients: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        properties: {
          recipeIngredientMembershipId: {type: 'number'},
          recipeId: {type: 'number'},
          ingredientId: {type: 'number'},
          ingredientAmount: {type: 'string'},
        },
        required: ['ingredientId', 'ingredientAmount'],
      },
    },
  },
  required: ['recipe', 'recipeIngredients'],
};

type UpdateRecipe = CreateRecipe;

export const updateRecipeSchema: JSONSchemaType<UpdateRecipe> = {
  type: 'object',
  properties: {
    recipe: {
      type: 'object',
      properties: {name: {type: 'string'}, steps: {type: 'array', minItems: 1, items: {type: 'string'}}, image: {type: 'string'}},
      required: ['name', 'steps','image'],
    },
    recipeIngredients: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        properties: {
          recipeIngredientMembershipId: {type: 'number'},
          recipeId: {type: 'number'},
          ingredientId: {type: 'number'},
          ingredientAmount: {type: 'string'},
        },
        required: ['recipeId', 'ingredientId', 'ingredientAmount'],
      },
    },
  },
  required: ['recipe', 'recipeIngredients'],
};
