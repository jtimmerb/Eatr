import {UserRecipe, UserRecipeEntity} from './entity';
import {Mapper} from '..';

export const UserRecipeMapper: Mapper<UserRecipe, UserRecipeEntity> = class {
  public static toDB(t: UserRecipe): UserRecipeEntity {
    return {
      user_recipe_membership_id: t.userRecipeMembershipId,
      user_id: t.userId,
      recipe_id: t.recipeId,
    };
  }

  public static fromDB(d: UserRecipeEntity): UserRecipe {
    return {
      userRecipeMembershipId: d.user_recipe_membership_id,
      userId: d.user_id,
      recipeId: d.recipe_id,
    };
  }
};
