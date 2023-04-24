export interface Recipe {
  recipeId: number;
  name: string;
  steps: string[];
  image: string;
}

export interface RecipeEntity {
  recipe_id: number;
  name: string;
  steps: string;
  image: string;
}
