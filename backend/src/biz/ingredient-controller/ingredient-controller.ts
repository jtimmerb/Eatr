import {Ingredient} from '../../data/ingredient/entity';
import IngredientRepo from '../../data/ingredient/repo';
import RepoController from '../repoController';

export default class IngredientController extends RepoController<IngredientRepo> {
  public createIngredient = async (newIngredient: Ingredient): Promise<Ingredient> => {
    const retIngredient = await this.getRepo().create(newIngredient);
    return retIngredient;
  };

  public deleteIngredient = async (ingredientID: number): Promise<void> => {
    if (await this.existsIngredient(ingredientID)) {
      const ingredient: Ingredient = {
        ingredientId: ingredientID,
        name: '',
        servingSize: '',
        calories: 0,
        proteins: 0,
        carbohydrates: 0,
        fats: 0,
      };
      await this.getRepo().delete(ingredient);
    } else {
      throw new Error();
    }
  };

  public updateIngredientMacros = async (ingredient: Ingredient): Promise<void> => {
    await this.getRepo().update(ingredient);
  };

  public getIngredient = async (ingredientID: number): Promise<Ingredient> => {
    if (await this.existsIngredient(ingredientID)) {
      const ingredient: Ingredient = {
        ingredientId: ingredientID,
        name: '',
        servingSize: '',
        calories: 0,
        proteins: 0,
        carbohydrates: 0,
        fats: 0,
      };
      const ingredientReceived = await this.getRepo().get(ingredient);
      return ingredientReceived;
    } else {
      throw new Error();
    }
  };

  public existsIngredient = async (ingredientID: number): Promise<Boolean> => {
    const ingredient: Ingredient = {
      ingredientId: ingredientID,
      name: '',
      servingSize: '',
      calories: 0,
      proteins: 0,
      carbohydrates: 0,
      fats: 0,
    };
    return this.getRepo().exists(ingredient);
  };

  public listIngredients = async (query: string): Promise<Ingredient[]> => {
    const ingredients: Ingredient[] = await this.getRepo().listIngredients(query);
    return ingredients;
  };
}
