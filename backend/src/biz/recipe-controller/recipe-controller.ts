import {Recipe} from '../../data/recipes/entity';
import RecipeRepo from '../../data/recipes/repo';
import RepoController from '../repoController';

export default class RecipeController extends RepoController<RecipeRepo> {
  public createRecipe = async (newRecipe: Recipe): Promise<Recipe> => {
    const Recipe = await this.getRepo().create(newRecipe);

    return Recipe;
  };

  public deleteRecipe = async (recipe: Recipe): Promise<void> => {
    const res = await this.getRepo().delete(recipe);
  };
}
