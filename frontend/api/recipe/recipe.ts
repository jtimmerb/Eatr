export interface Recipe {
  recipeId: number;
  name: string;
  ingredients: string[];
  steps: string[];
  image: string;
}

export type ListRecipesResponse = Recipe[];

export interface UserRecipe {
  userRecipeMembershipId: number;
  userId: number;
  recipeId: number;
}

export interface CreateUserRecipeRequest {
  recipeId: number;
}

export interface CreateUserRecipeResponse extends UserRecipe {}
