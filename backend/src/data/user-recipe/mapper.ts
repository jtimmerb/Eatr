import {UserRecipe, UserRecipeEntity} from './entity';
import {Mapper} from '..';

export const UserRecipeMapper: Mapper<UserRecipe, UserRecipeEntity> = class {
  public static toDB(t: UserRecipe): UserRecipeEntity {
    return {
      userRecipeMembershipId: t.userRecipeMembershipId,
      userId: t.userId,
      recipeId: t.recipeId,
    };
  }

  public static fromDB(d: UserRecipeEntity): UserRecipe {
    return {
      userRecipeMembershipId: d.userRecipeMembershipId,
      userId: d.userId,
      recipeId: d.recipeId,
    };
  }
};
