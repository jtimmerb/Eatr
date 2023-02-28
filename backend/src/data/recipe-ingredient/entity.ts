export interface RecipeIngredient {
  recipeIngredientMembershipId: number;
  recipeId: number;
  ingredientId: number;
  ingredientAmount: string;
}

export interface RecipeIngredientEntity {
  recipe_ingredient_membership_id: number;
  recipe_id: number;
  ingredient_id: number;
  ingredient_amount: string;
}
