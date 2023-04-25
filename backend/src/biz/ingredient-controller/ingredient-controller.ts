import {Ingredient} from '../../data/ingredient/entity';
import IngredientRepo from '../../data/ingredient/repo';
import BadRequest from '../../utility/error/badRequest';
import RepoController from '../repoController';

export default class IngredientController extends RepoController<IngredientRepo> {
  public createIngredient = async (newIngredient: Ingredient): Promise<Ingredient> => {
    // Check that there isn't a copy of this ingredient.
    const sameNameIngredients = await this.getIngredientsByName(newIngredient.name);
    if (sameNameIngredients.length !== 0)
      throw new BadRequest(`Ingredient with name '${newIngredient.name}' already exists.`);

    // Create ingredient
    const retIngredient = await this.getRepo().create(newIngredient);
    return retIngredient;
  };

  public deleteIngredient = async (ingredientID: number): Promise<void> => {
    await this.getRepo().getById(ingredientID);
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
    const ingredientReceived = await this.getRepo().getById(ingredientID);
    return ingredientReceived;
  };

  public getIngredientsByName = async (name: string): Promise<Ingredient[]> => {
    const ingredientReceived = await this.getRepo().getByName(name);
    return ingredientReceived;
  };

  public existsIngredient = async (ingredientID: number): Promise<boolean> => {
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
}
