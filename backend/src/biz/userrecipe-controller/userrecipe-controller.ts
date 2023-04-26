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
import BadRequest from '../../utility/error/badRequest';
import NotFound from '../../utility/error/notFound';

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
    if (!(await this.userController.existUserById(userID))) throw new NotFound(userID.toString(), 'userID');
    if (!(await this.recipeController.existsRecipe(recipeID))) throw new NotFound(recipeID.toString(), 'recipeID');

    if ((await this.getMembershipCount(userID)) > 9)
      throw new BadRequest('User has recipe maximum of 10 liked recipes');

    const userRecipe: UserRecipe = {
      userRecipeMembershipId: 0,
      userId: userID,
      recipeId: recipeID,
    };

    const newUserRecipe: UserRecipe = await this.repo.create(userRecipe);
    return newUserRecipe;
  };

  public deleteUserRecipe = async (userID: number, recipeID: number): Promise<void> => {
    const userRecipe: UserRecipe = {
      userRecipeMembershipId: 0,
      userId: userID,
      recipeId: recipeID,
    };
    await this.repo.deleteByUserAndRecipe(userRecipe);
    return;
  };

  public getMembershipCount = async (userID: number): Promise<number> => {
    if (!(await this.userController.existUserById(userID))) throw new NotFound(userID.toString(), 'userID');
    const recievedUserRecipe: UserRecipe[] = await this.repo.getByUserId(userID);
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

  public getUsersLikedRecipes = async (userID: number): Promise<Recipe[]> => {
    if (!(await this.userController.existUserById(userID))) throw new NotFound(userID.toString(), 'userID');

    const userRecipe: UserRecipe = {
      userRecipeMembershipId: 0,
      userId: userID,
      recipeId: 0,
    };
    const likedRecipes: UserRecipe[] = await this.repo.getByUserId(userID);

    const recipes: Recipe[] = [];

    for (const likedRecipe of likedRecipes) {
      recipes.push(await this.recipeController.getRecipe(likedRecipe.recipeId));
    }

    return recipes;
  };
}
