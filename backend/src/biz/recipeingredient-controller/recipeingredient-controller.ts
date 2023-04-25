import {RecipeIngredient, RecipeIngredientQuery} from '../../data/recipe-ingredient/entity';
import {Recipe} from '../../data/recipes/entity';
import {Ingredient} from '../../data/ingredient/entity';
import RecipeIngredientRepo from '../../data/recipe-ingredient/repo';
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

  public deleteRecipe = async (recipeID: number): Promise<void> => {
    const recipeIngredient: RecipeIngredient = {
      recipeIngredientMembershipId: 0,
      recipeId: recipeID,
      ingredientId: 0,
      ingredientAmount: '',
    };
    await this.repo.deleteByRecipeId(recipeIngredient);
  };

  public updateRecipe = async (newRecipeIngredients: RecipeIngredient[]): Promise<void> => {
    newRecipeIngredients.forEach(async recipeIngredient => {
      await this.repo.update(recipeIngredient);
    });
  };

  public getRecipesByIngredients = async (ingredientIDs: number[]): Promise<Recipe[]> => {
    // Fetch all recipe ingredients
    let recipeIngredients: RecipeIngredient[] = [];
    for (const ingredientID of ingredientIDs) {
      recipeIngredients.push(...(await this.repo.getByIngredientID(ingredientID)));
    }

    // Filter for unique recipes
    const uniq = new Set<number>();
    recipeIngredients = recipeIngredients.filter(ri => {
      if (uniq.has(ri.recipeId)) return false;
      uniq.add(ri.recipeId);
      return true;
    });

    const recipes: Recipe[] = [];

    for (const ri of recipeIngredients) {
      recipes.push(await this.recipeController.getRecipe(ri.recipeId));
    }
    return recipes;
  };

  public getRecipeIngredient = async (recipeID: number): Promise<RecipeIngredient[]> => {
    const recipe: Recipe = {
      recipeId: recipeID,
      name: '',
      steps: [],
      image: '',
    };
    const recipeIngredients: RecipeIngredient[] = await this.repo.getByRecipeID(recipe);
    return recipeIngredients;
  };
}
