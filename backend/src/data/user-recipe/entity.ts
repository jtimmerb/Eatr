import { Recipe } from "../recipes/entity";
import { User } from "../users/entity";

export interface UserRecipe {
  userRecipeMembershipId: number;
  userId: number;
  recipeId: number;
}

export interface UserRecipeEntity {
  user_recipe_membership_id: number;
  user_id: number;
  recipe_id: number;
}


export interface UserRecipeWithSteps {
    userRecipe: UserRecipe
    recipe : Recipe
}