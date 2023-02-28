import {RecipeIngredient, RecipeIngredientEntity} from './entity';
import {Mapper} from '..';

export const RecipeIngredientMapper: Mapper<RecipeIngredient, RecipeIngredientEntity> = class {
  public static toDB(t: RecipeIngredient): RecipeIngredientEntity {
    return {
      recipe_ingredient_membership_id: t.recipeIngredientMembershipId,
      recipe_id: t.recipeId,
      ingredient_id: t.ingredientId,
      ingredient_amount: t.ingredientAmount,
    };
  }

  public static fromDB(d: RecipeIngredientEntity): RecipeIngredient {
    return {
      recipeIngredientMembershipId: d.recipe_ingredient_membership_id,
      recipeId: d.recipe_id,
      ingredientId: d.ingredient_id,
      ingredientAmount: d.ingredient_amount,
    };
  }
};
