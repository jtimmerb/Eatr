import {RecipeIngredient, RecipeIngredientQuery} from '../../data/recipe-ingredient/entity';
import {User} from '../../data/users/entity'
import {Recipe} from '../../data/recipes/entity';
import {Ingredient} from '../../data/ingredient/entity';
import { UserRecipe } from '../../data/user-recipe/entity';
import {UserPantry } from '../../data/user-pantry/entity';
import IngredientRepo from '../../data/ingredient/repo';
import RecipeRepo from '../../data/recipes/repo';
import UserRepo from '../../data/users/repo'
import UserRecipeRepo from '../../data/user-recipe/repo';
import UserPantryRepo from '../../data/user-pantry/repo';
import RepoController from '../repoController';
import UserPantryController from '../userpantry-controller/userpantry-controller';
import UserRecipeController from '../userrecipe-controller/userrecipe-controller';
import RecipeController from '../recipe-controller/recipe-controller';
import IngredientController from '../ingredient-controller/ingredient-controller';

export default class UserController{
  private repo: UserRepo
  private userRecipeRepo : UserRecipeRepo
  private userPantryRepo : UserPantryRepo
  private ingredientController: IngredientController;
  private recipeController: RecipeController;

  constructor(repo: UserRepo, ingredientController: IngredientController, recipeController: RecipeController,
              userRecipeRepo: UserRecipeRepo, userPantryRepo: UserPantryRepo) {
    this.repo = repo
    this.ingredientController = ingredientController;
    this.recipeController = recipeController;
    this.userPantryRepo = userPantryRepo
    this.userRecipeRepo = userRecipeRepo
  }
  public createUser = async (userName: string): Promise<User> => {
    const user: User = {
      userId: 0,
      name: userName,
    };
    const newUser = await this.repo.create(user);
    return user;
  };

  public deleteUser = async (userID: number): Promise<void> => {
    const deleteUser: User = {
      userId: userID,
      name: '',
    };
    await this.repo.delete(deleteUser);
  };

  public getUser = async (userId: number): Promise<User> => {
    const queryUser: User = {
      userId: userId,
      name: '',
    };
    const user = await this.repo.get(queryUser);
    return user;
  };

  public getUsersLikedRecipes = async (userID: number): Promise<Recipe[]> => {
    const userRecipe: UserRecipe = {
      userRecipeMembershipId: 0,
      userId: userID,
      recipeId: 0
    };
    const receivedUserRecipe: UserRecipe[] = await this.userRecipeRepo.getByUserId(userRecipe);
    const receivedRecipe: Recipe[] = [];
    for(let i = 0; i < receivedUserRecipe.length; i++){
      receivedRecipe.push(await this.recipeController.getRecipe(receivedUserRecipe[i].recipeId));
    }
    return receivedRecipe;
  }

  public getUsersPantry = async (userID: number): Promise<Ingredient[]> => {
    const userPantry: UserPantry = {
      upMembershipId: 0,
      userId: userID,
      ingredientId: 0,
      ingredientAmount: ''
    };
    const receivedUserPantry: UserPantry[] = await this.userPantryRepo.getByUserId(userPantry);
    const receivedIngredients: Ingredient[] = [];
    for(let i = 0; i < receivedUserPantry.length; i++){
      receivedIngredients.push(await this.ingredientController.getIngredient(receivedUserPantry[i].ingredientId));
    }
    return receivedIngredients;
  }
}
