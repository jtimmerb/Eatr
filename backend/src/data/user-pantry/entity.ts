import { Ingredient } from "../ingredient/entity";

export interface UserPantry {
  upMembershipId: number;
  userId: number;
  ingredientId: number;
  ingredientAmount: string;
}

export interface UserPantryEntity {
  up_membership_id: number;
  user_id: number;
  ingredient_id: number;
  ingredient_amount: string;
}

export interface UserPantryIngredients {
  userPantry : UserPantry;
  ingredient : Ingredient;
}
