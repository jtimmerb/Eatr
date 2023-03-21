import {RecipeIngredient, RecipeIngredientQuery} from '../../data/recipe-ingredient/entity';
import {Recipe} from '../../data/recipes/entity';
import {Ingredient} from '../../data/ingredient/entity';
import IngredientRepo from '../../data/ingredient/repo';
import RecipeRepo from '../../data/recipes/repo';
import RecipeIngredientRepo from '../../data/recipe-ingredient/repo';
import RepoController from '../repoController';
import RecipeController from '../recipe-controller/recipe-controller';
import IngredientController from '../ingredient-controller/ingredient-controller';

export default class RecipeIngredientController {
  private repo: RecipeIngredientRepo;

  private recipeController: RecipeController;
  private ingredientController: IngredientController;

  constructor(
    repo: RecipeIngredientRepo,
    recipeController: RecipeController,
    ingredientController: IngredientController,
  ) {
    this.repo = repo;
    this.recipeController = recipeController;
    this.ingredientController = ingredientController;
  }

  public createRecipeIngredient = async (newRecipeIngredients: RecipeIngredient[]): Promise<RecipeIngredient[]> => {
    const returnRecipeIngredient: RecipeIngredient[] = [];

    for (let i = 0; i < newRecipeIngredients.length; i++) {
      const item = await this.repo.create(newRecipeIngredients[i]);
      returnRecipeIngredient.push(item);
    }
    return returnRecipeIngredient;
  };

  public deleteRecipe = async (recipeIngredients: RecipeIngredient[]): Promise<void> => {
    recipeIngredients.forEach(async recipeIngredient => {
      await this.repo.delete(recipeIngredient);
    });
  };

  public updateRecipe = async (newRecipeIngredients: RecipeIngredient[]): Promise<void> => {
    newRecipeIngredients.forEach(async recipeIngredient => {
      await this.repo.update(recipeIngredient);
    });
  };

  public getFiveRandomRecipes = async (ingredientFilter: number[]): Promise<Recipe[]> => {
    const ingredient: Ingredient = {
      ingredientId: ingredientFilter[0],
      name: '',
      servingSize: '',
      calories: 0,
      proteins: 0,
      carbohydrates: 0,
      fats: 0,
    };
    const receivedRecipeIngredient = await this.repo.getByIngredientID(ingredient);
    const randomNums: number[] = [];
    const randomRecipes: Recipe[] = [];

    for (let i = 0; i < receivedRecipeIngredient.length; i++) {
      const randomInt = Math.floor(Math.random() * (receivedRecipeIngredient.length - 1));
      if (randomNums.includes(randomInt) == false && randomRecipes.length < 5) {
        randomNums.push(randomInt);
        randomRecipes.push(await this.recipeController.getRecipe(receivedRecipeIngredient[randomInt].recipeId));
      }
    }
    return randomRecipes;
  };

  public getRecipeIngredient = async (recipeID: number): Promise<RecipeIngredient[]> => {
    const recipe: Recipe = {
      recipeId: recipeID,
      name: '',
      steps: [],
    };
    const recipeIngredients: RecipeIngredient[] = await this.repo.getByRecipeID(recipe);
    console.log(recipeIngredients);
    return recipeIngredients;
  };
}

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
