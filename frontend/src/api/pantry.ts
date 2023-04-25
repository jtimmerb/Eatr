export interface UserPantryIngredients {
  userPantry: UserPantry;
  ingredient: Ingredient;
}

export interface UserPantry {
  upMembershipId: number;
  userId: number;
  ingredientId: number;
  ingredientAmount: string;
}

export interface Ingredient {
  ingredientId: number;
  name: string;
  servingSize: string;
  calories: number;
  proteins: number;
  carbohydrates: number;
  fats: number;
}

export type ListIngredients = Ingredient[];

export type ListUserPantryIngredients = UserPantryIngredients[];

export interface CreateUserIngredientRequest {
  ingredientId: number;
  ingredientAmount: string;
}
