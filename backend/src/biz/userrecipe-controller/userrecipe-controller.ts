import {RecipeIngredient, RecipeIngredientQuery} from '../../data/recipe-ingredient/entity';
import {User} from '../../data/users/entity';
import {Recipe} from '../../data/recipes/entity';
import {Ingredient} from '../../data/ingredient/entity';
import {UserRecipe, UserRecipeWithSteps} from '../../data/user-recipe/entity';
import IngredientRepo from '../../data/ingredient/repo';
import RecipeRepo from '../../data/recipes/repo';
import UserRecipeRepo from '../../data/user-recipe/repo';
import RecipeIngredientRepo from '../../data/recipe-ingredient/repo';
import RepoController from '../repoController';
import RecipeController from '../recipe-controller/recipe-controller';
import IngredientController from '../ingredient-controller/ingredient-controller';
import UserController from '../user-controller/user-controller';

export default class UserRecipeController {
  private repo: UserRecipeRepo;

  private recipeController: RecipeController;
  private userController: UserController;

  constructor(repo: UserRecipeRepo, recipeController: RecipeController, userController: UserController) {
    this.repo = repo;
    this.recipeController = recipeController;
    this.userController = userController;
  }

  public createUserRecipe = async (userID: number, recipeID: number): Promise<UserRecipe> => {
    const userRecipe: UserRecipe = {
      userRecipeMembershipId: 0,
      userId: userID,
      recipeId: recipeID,
    };
    //console.log(userRecipe);
    const newUserRecipe: UserRecipe = await this.repo.create(userRecipe);
    console.log(newUserRecipe);
    return newUserRecipe;
  };

  public deleteUserRecipe = async (userID: number, recipeID: number): Promise<void> => {
    const userRecipe: UserRecipe = {
      userRecipeMembershipId: 0,
      userId: userID,
      recipeId: recipeID,
    };
    await this.repo.deleteByUserAndRecipe(userRecipe);
  };

  public getMembershipCount = async (userID: number): Promise<number> => {
    const userRecipe: UserRecipe = {
      userRecipeMembershipId: 0,
      userId: userID,
      recipeId: 0,
    };
    const recievedUserRecipe: UserRecipe[] = await this.repo.getByUserId(userRecipe);
    console.log(recievedUserRecipe);
    return recievedUserRecipe.length;
  };

  public getRecipeFromId = async (userRecipeMembershipID: number): Promise<Recipe> => {
    const userRecipe: UserRecipe = {
      userRecipeMembershipId: userRecipeMembershipID,
      userId: 0,
      recipeId: 0,
    };
    const receivedUserRecipe: UserRecipe = await this.repo.get(userRecipe);
    const receivedRecipe: Recipe = await this.recipeController.getRecipe(receivedUserRecipe.recipeId);
    return receivedRecipe;
  };

  public getUsersLikedRecipes = async (userID: number): Promise<UserRecipeWithSteps[]> => {
    const userRecipe: UserRecipe = {
      userRecipeMembershipId: 0,
      userId: userID,
      recipeId: 0,
    };
    if (await this.userController.existUser(userID)) {
      const receivedUserRecipe: UserRecipe[] = await this.repo.getByUserId(userRecipe);
      const receivedUserRecipeWithSteps: UserRecipeWithSteps[] = [];
      for (let i = 0; i < receivedUserRecipe.length; i++) {
        const userRecipeWithSteps: UserRecipeWithSteps = {
          userRecipe : receivedUserRecipe[i],
          recipe: await this.recipeController.getRecipe(receivedUserRecipe[i].recipeId)
        }
        receivedUserRecipeWithSteps.push(userRecipeWithSteps);
      }
      return receivedUserRecipeWithSteps;
    } else {
      throw new Error();
    }
  };
}
