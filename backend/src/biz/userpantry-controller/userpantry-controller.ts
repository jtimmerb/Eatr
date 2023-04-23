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
    if(await this.userController.existUserById(userID) && await this.ingredientController.existsIngredient(ingredientID)){
      const userPantry: UserPantry = {
        upMembershipId: 0,
        userId: userID,
        ingredientId: ingredientID,
        ingredientAmount: ingredientAmount,
      };
      const newUserPantry = await this.repo.create(userPantry);
      return newUserPantry;
    }
    else{
      throw new Error();
    }
  };

  public deleteUserPantry = async (userID: number, ingredientID: number): Promise<void> => {
    if(await this.userController.existUserById(userID) && await this.ingredientController.existsIngredient(ingredientID)){
      const userPantry: UserPantry = {
        upMembershipId: 0,
        userId: userID,
        ingredientId: ingredientID,
        ingredientAmount: '',
      };
      await this.repo.deleteByUserAndIngr(userPantry);
    }
    else{
      throw new Error();
    }
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
    if (await this.userController.existUserById(userID)) {
      const receivedUserPantry: UserPantry[] = await this.repo.getByUserId(userPantry);
      const receivedUserPantryIngredients: UserPantryIngredients[] = [];
      for (let i = 0; i < receivedUserPantry.length; i++) {
        const userPantryIngredients: UserPantryIngredients = {
          userPantry : receivedUserPantry[i],
          ingredient: await this.ingredientController.getIngredient(receivedUserPantry[i].ingredientId)
        }
        receivedUserPantryIngredients.push(userPantryIngredients);
      }
      return receivedUserPantryIngredients;
    } else {
      throw new Error();
    }
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
