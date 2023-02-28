export interface Ingredient {
  ingredientId: number;
  name: string;
  servingSize: string;
  calories: number;
  proteins: number;
  carbohydrates: number;
  fats: number;
}

export interface IngredientEntity {
  ingredient_id: number;
  name: string;
  serving_size: string;
  calories: number;
  proteins: number;
  carbohydrates: number;
  fats: number;
}
