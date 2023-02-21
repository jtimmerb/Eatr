export interface Recipe {
  recipeID: number;
  name: string;
  steps: string[];
}

export interface RecipeEntity {
  recipeID: number;
  name: string;
  steps: string;
}
