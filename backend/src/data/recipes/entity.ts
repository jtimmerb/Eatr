export interface Recipe {
  recipeId: number;
  name: string;
  steps: string[];
}

export interface RecipeEntity {
  recipe_id: number;
  name: string;
  steps: string;
}
