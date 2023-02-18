import {RecipeIngredient, RecipeIngredientEntity} from './entity';
import {RecipeIngredientMapper} from './mapper';
import {Repo} from '..';

interface IngredientAmount {
  ingredientId: number;
  ingredientAmount: string;
}

interface RecipeIngredientRepoInterface extends Repo<RecipeIngredient> {
  getIngredientByRecipeId(recipeId: number): Promise<IngredientAmount[]>;
}

export default class RecipeIngredientRepo implements RecipeIngredientRepoInterface {
  private postgreDB: any;

  constructor(postgreDB: any) {
    this.postgreDB = postgreDB;
  }
}
