import {Recipe} from '../../data/recipes/entity';
import RecipeRepo from '../../data/recipes/repo';
import RepoController from '../repoController';

export default class RecipeController extends RepoController<RecipeRepo> {
  public createRecipe = async (newRecipe: Recipe): Promise<Recipe> => {
    const recipe = await this.getRepo().create(newRecipe);
    return recipe;
  };

  public deleteRecipe = async (recipe: Recipe): Promise<void> => {
    const res = await this.getRepo().delete(recipe);
  };

  public updateRecipe = async (newRecipe: Recipe): Promise<void> => {
    const res = await this.getRepo().update(newRecipe);
  };

  public getRecipe = async (recipeID: number): Promise<Recipe> => {
    const recipe: Recipe = {
      recipeId: recipeID,
      name : "",
      steps: []
  }
    const recipeReceived = await this.getRepo().get(recipe);
    return recipeReceived
  };
}
