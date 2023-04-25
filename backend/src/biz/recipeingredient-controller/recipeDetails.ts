export interface IngredientPortion {
  name: string;
  amount: string;
}

export interface RecipeDetails {
  ingredients: IngredientPortion[];
}
