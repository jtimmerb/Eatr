import {Recipe} from '../../data/recipes/entity';
import RecipeRepo from '../../data/recipes/repo';
import RepoController from '../repoController';

export default class RecipeController extends RepoController<RecipeRepo> {
  public createRecipe = async (newRecipe: Recipe): Promise<Recipe> => {
    const recipe = await this.getRepo().create(newRecipe);
    return recipe;
  };

  public deleteRecipe = async (recipeID: number): Promise<void> => {
    if (await this.existsRecipe(recipeID)) {
      const recipe: Recipe = {
        recipeId: recipeID,
        name: '',
        steps: [],
        image: '',
      };
      await this.getRepo().delete(recipe);
    } else {
      throw new Error();
    }
  };

  public updateRecipe = async (newRecipe: Recipe): Promise<void> => {
    await this.getRepo().update(newRecipe);
  };

  public getRecipe = async (recipeID: number): Promise<Recipe> => {
    if (await this.existsRecipe(recipeID)) {
      const recipe: Recipe = {
        recipeId: recipeID,
        name: '',
        steps: [],
        image: '',
      };
      const recipeReceived = await this.getRepo().get(recipe);
      return recipeReceived;
    } else {
      throw new Error();
    }
  };

  public existsRecipe = async (recipeID: number): Promise<boolean> => {
    const recipe: Recipe = {
      recipeId: recipeID,
      name: '',
      steps: [],
      image: '',
    };
    return await this.getRepo().exists(recipe);
  };
}
