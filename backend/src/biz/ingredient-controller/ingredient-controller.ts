import {Ingredient} from '../../data/ingredient/entity';
import IngredientRepo from '../../data/ingredient/repo';
import RepoController from '../repoController';

export default class IngredientController extends RepoController<IngredientRepo> {
    public createIngredient = async (newIngredient: Ingredient): Promise<Ingredient> => {
      const user = await this.getRepo().create(newIngredient);
      return newIngredient;
    };
  
    public deleteIngredient = async (ingredient: Ingredient): Promise<void> => {
      const res = await this.getRepo().delete(ingredient);
    };

    public updateIngredientMacros = async (ingredient: Ingredient): Promise<void> => {
        const res = await this.getRepo().update(ingredient);
      };

    public getIngredientMacros = async (ingredientID: number): Promise<Ingredient> => {
        const ingredient: Ingredient = {
            ingredientId: ingredientID,
            name: "",
            servingSize: "",
            calories: 0,
            proteins: 0,
            carbohydrates: 0,
            fats: 0,
          }
        const ingredientReceived = await this.getRepo().get(ingredient);
        return ingredientReceived
    };  
  
  }