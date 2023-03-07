import {RecipeIngredient, RecipeIngredientQuery} from '../../data/recipe-ingredient/entity';
import {User} from '../../data/users/entity'
import {Recipe} from '../../data/recipes/entity';
import {Ingredient} from '../../data/ingredient/entity';
import { UserRecipe } from '../../data/user-recipe/entity';
import IngredientRepo from '../../data/ingredient/repo';
import RecipeRepo from '../../data/recipes/repo';
import UserRecipeRepo from '../../data/user-recipe/repo';
import RecipeIngredientRepo from '../../data/recipe-ingredient/repo';
import RepoController from '../repoController';
import RecipeController from '../recipe-controller/recipe-controller';
import IngredientController from '../ingredient-controller/ingredient-controller'
import UserController  from '../user-controller/user-controller';

export default class UserRecipeController {
  private repo: UserRecipeRepo;

  private recipeController: RecipeController;
  private userController: UserController;

  constructor(repo: UserRecipeRepo, recipeController: RecipeController, userController: UserController) {
    this.repo = repo;
    this.recipeController = recipeController;
    this.userController = userController;
  }

  public createUserRecipe = async (newUserRecipe: UserRecipe[]): Promise<UserRecipe[]> => {
    const returnUserRecipe: UserRecipe[] = [];

    newUserRecipe.forEach(async newUserRecipe => {
      const item = await this.repo.create(newUserRecipe);
      returnUserRecipe.push(item);
    });

    return returnUserRecipe;
  }

  public deleteUserRecipe = async (userRecipe: UserRecipe[]): Promise<void> => {
    userRecipe.forEach(async userRecipe => {
      await this.repo.delete(userRecipe);
    });
  }

  public getUserRecipe = async (userRecipeMembershipID: number): Promise<Recipe> => {
    const userRecipe: UserRecipe = {
        userRecipeMembershipId: userRecipeMembershipID,
        userId: 0,
        recipeId: 0
      };

    const returnedUserRecipe = await this.repo.get(userRecipe)
    const returnedRecipe = await this.recipeController.getRecipe(returnedUserRecipe.recipeId)
    return returnedRecipe
  }
}