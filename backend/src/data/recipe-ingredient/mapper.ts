import {RecipeIngredient, RecipeIngredientEntity} from './entity';
import {Mapper} from '..';

export const RecipeIngredientMapper: Mapper<RecipeIngredient, RecipeIngredientEntity> = class {
  public static toDB(t: RecipeIngredient): RecipeIngredientEntity {
    return {
      recipeIngredientMembershipId: t.recipeIngredientMembershipId,
      recipeId: t.recipeId,
      ingredientId: t.ingredientId,
      ingredientAmount: t.ingredientAmount,
    };
  }

  public static fromDB(d: RecipeIngredientEntity): RecipeIngredient {
    return {
      recipeIngredientMembershipId: d.recipeIngredientMembershipId,
      recipeId: d.recipeId,
      ingredientId: d.ingredientId,
      ingredientAmount: d.ingredientAmount,
    };
  }
};
