export interface Recipe {
  recipeId: number;
  name: string;
  steps: string[];
}

export interface RecipeEntity {
  recipeId: number;
  name: string;
  steps: string;
}
