import UserPantryRepo from '../../data/user-pantry/repo';
import {Ingredient} from '../../data/ingredient/entity';
import {UserPantry, UserPantryIngredients} from '../../data/user-pantry/entity';
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
    const user = await this.userController.getUser(userID);
    const ingredient = await this.ingredientController.getIngredient(ingredientID);
    const userPantry: UserPantry = {
      upMembershipId: 0,
      userId: user.userId,
      ingredientId: ingredient.ingredientId,
      ingredientAmount: ingredientAmount,
    };
    const newUserPantry = await this.repo.create(userPantry);
    return newUserPantry;
  };

  public deleteUserPantry = async (userID: number, ingredientID: number): Promise<void> => {
    await this.userController.getUser(userID);
    await this.ingredientController.getIngredient(ingredientID);

    const userPantry: UserPantry = {
      upMembershipId: 0,
      userId: userID,
      ingredientId: ingredientID,
      ingredientAmount: '',
    };
    await this.repo.deleteByUserAndIngr(userPantry);
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

  public getUsersPantry = async (userID: number): Promise<UserPantryIngredients[]> => {
    const userPantry: UserPantry = {
      upMembershipId: 0,
      userId: userID,
      ingredientId: 0,
      ingredientAmount: '',
    };
    await this.userController.getUser(userID);
    const receivedUserPantry: UserPantry[] = await this.repo.getByUserId(userPantry);
    const receivedUserPantryIngredients: UserPantryIngredients[] = [];
    for (let i = 0; i < receivedUserPantry.length; i++) {
      const userPantryIngredients: UserPantryIngredients = {
        userPantry: receivedUserPantry[i],
        ingredient: await this.ingredientController.getIngredient(receivedUserPantry[i].ingredientId),
      };
      receivedUserPantryIngredients.push(userPantryIngredients);
    }
    return receivedUserPantryIngredients;
  };
  // public updateIngredientAmount = async(userPantry, newAmount: string): Promise<void> =>{
  //   constItem =

  //   const userPantry: UserPantry = {
  //       upMembershipId: upMembershipID,
  //       userId: 0,
  //       ingredientId: 0,
  //       ingredientAmount: ""
  //     };
  // }
}
