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

  public deleteUserRecipe = async (userID: number, recipeID : number): Promise<void> => {
    const userRecipe: UserRecipe = {
        userRecipeMembershipId: 0,
        userId: userID,
        recipeId: recipeID
      };
    await this.repo.delete(userRecipe);
  }

  public getMembershipCount = async (userID: number): Promise<number> => {
    const userRecipe: UserRecipe = {
        userRecipeMembershipId: 0,
        userId: userID,
        recipeId: 0
      };
    const recievedUserPantry: UserRecipe[] = await this.repo.getByUserId(userRecipe);
    console.log(recievedUserPantry);
    return recievedUserPantry.length;
  }

  public getRecipeFromId = async (userRecipeMembershipID : number): Promise <Recipe> =>{
    const userRecipe: UserRecipe = {
      userRecipeMembershipId : userRecipeMembershipID,
      userId: 0,
      recipeId: 0
    }
    const receivedUserRecipe = this.repo.get(userRecipe);
    const receivedRecipe = this.recipeController.getRecipe((await receivedUserRecipe).recipeId)
    return receivedRecipe
  }
}