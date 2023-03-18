import UserPantryRepo from '../../data/user-pantry/repo';
import {User} from '../../data/users/entity';
import {Recipe} from '../../data/recipes/entity';
import {Ingredient} from '../../data/ingredient/entity';
import {UserPantry} from '../../data/user-pantry/entity';
import IngredientRepo from '../../data/ingredient/repo';
import RecipeRepo from '../../data/recipes/repo';
import UserRecipeRepo from '../../data/user-recipe/repo';
import RecipeIngredientRepo from '../../data/recipe-ingredient/repo';
import RepoController from '../repoController';
import RecipeController from '../recipe-controller/recipe-controller';
import IngredientController from '../ingredient-controller/ingredient-controller';
import UserController from '../user-controller/user-controller';

export default class UserPantryController {
  private repo: UserPantryRepo;

  private userController: UserController;
  private ingredientController: IngredientController;

  constructor(repo: UserPantryRepo, ingredientController: IngredientController, userController: UserController) {
    this.repo = repo;
    this.ingredientController = ingredientController;
    this.userController = userController;
  }

  public createUserPantry = async (
    userID: number,
    ingredientID: number,
    ingredientAmount: string,
  ): Promise<UserPantry> => {
    const userPantry: UserPantry = {
      upMembershipId: 0,
      userId: userID,
      ingredientId: ingredientID,
      ingredientAmount: '',
    };
    const newUserPantry = await this.repo.create(userPantry);
    return newUserPantry;
  };

  public deleteUserPantry = async (userID: number, ingredientID: number): Promise<void> => {
    const userPantry: UserPantry = {
      upMembershipId: 0,
      userId: userID,
      ingredientId: ingredientID,
      ingredientAmount: '',
    };
    await this.repo.delete(userPantry);
  };

  public getPantryItem = async (upMembershipID: number): Promise<Ingredient> => {
    const userPantry: UserPantry = {
      upMembershipId: upMembershipID,
      userId: 0,
      ingredientId: 0,
      ingredientAmount: '',
    };
    const recievedUserPantryItem: UserPantry = await this.repo.get(userPantry);
    const receivedIngredient: Ingredient = await this.ingredientController.getIngredient(
      recievedUserPantryItem.ingredientId,
    );
    return receivedIngredient;
  };

  public updateIngredientAmount = async (upMembershipID: number, newAmount: string): Promise<void> => {
    const userPantry: UserPantry = {
      upMembershipId: upMembershipID,
      userId: 0,
      ingredientId: 0,
      ingredientAmount: '',
    };
    const receivedUserPantry: UserPantry = await this.repo.get(userPantry);
    const updatedUserPantry: UserPantry = {
      upMembershipId: receivedUserPantry.upMembershipId,
      userId: receivedUserPantry.userId,
      ingredientId: receivedUserPantry.ingredientId,
      ingredientAmount: newAmount,
    };
    await this.repo.update(updatedUserPantry);
  };
}
