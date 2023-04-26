import { Ingredient } from "./pantry";

export interface Recipe {
  recipeId: number;
  name: string;
  steps: string[];
  image: string;
}

export interface IngredientPortion {
  name: string;
  amount: string;
}

export interface RecipeDetails {
  ingredients: IngredientPortion[];
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

export interface RecipeDetails {
  recipe: Recipe;
  details: RecipeDetails;
}

export type GetRecipeDetails = RecipeDetails;

export type ListSavedRecipes = Recipe[];

export interface RecipeIngredient {
  recipeIngredientMembershipId: number;
  recipeId: number;
  ingredientId: number;
  ingredientAmount: string;
}

export interface CreateRecipeRequest {
  recipe: { name: string; steps: string[]; image: string };
  recipeIngredients: RecipeIngredient[];
}
