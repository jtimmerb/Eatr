import {Ingredient} from '../../data/ingredient/entity';
import IngredientRepo from '../../data/ingredient/repo';
import RepoController from '../repoController';

export default class IngredientController extends RepoController<IngredientRepo> {
  public createIngredient = async (newIngredient: Ingredient): Promise<Ingredient> => {
    const retIngredient = await this.getRepo().create(newIngredient);
    return retIngredient;
  };

  public deleteIngredient = async (ingredientID: number): Promise<void> => {
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
  };

  public updateIngredientMacros = async (ingredient: Ingredient): Promise<void> => {
    await this.getRepo().update(ingredient);
  };

  public getIngredient = async (ingredientID: number): Promise<Ingredient> => {
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
  };
}
