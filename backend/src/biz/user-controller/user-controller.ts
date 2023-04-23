import {User} from '../../data/users/entity';
import UserRepo from '../../data/users/repo';

export default class UserController {
  private repo: UserRepo;

  constructor(repo: UserRepo) {
    this.repo = repo;
  }
  public createUser = async (userName: string): Promise<User> => {
    const user: User = {
      userId: 0,
      name: userName,
    };
    console.log('biz before create');
    const newUser = await this.repo.create(user);
    console.log('biz after create', newUser);
    return newUser;
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
    if(await this.existUserById(userId)){
      const user = await this.repo.get(queryUser);
      return user;
    }
    else{
      throw new Error()
    }
  };

  public getUserByName = async (userName: string): Promise<User[]> => {
    const queryUser: User = {
      userId: 0,
      name: userName,
    };
    if(await this.existUserByName(userName)){
      const user : User[] = await this.repo.getbyName(queryUser);
      return user;
    }
    else{
      throw new Error()
    }
  };

  public existUserById = async (userId: number): Promise<boolean> => {
    const queryUser: User = {
      userId: userId,
      name: '',
    };
    return await this.repo.exists(queryUser);
  };

  public existUserByName = async (userName: string): Promise<boolean> => {
    const queryUser: User = {
      userId: 0,
      name: userName,
    };
    return await this.repo.existsByName(queryUser);
  };



  // public getUsersLikedRecipes = async (userID: number): Promise<Recipe[]> => {
  //   const userRecipe: UserRecipe = {
  //     userRecipeMembershipId: 0,
  //     userId: userID,
  //     recipeId: 0,
  //   };
  //   const receivedUserRecipe: UserRecipe[] = await this.userRecipeRepo.getByUserId(userRecipe);
  //   const receivedRecipe: Recipe[] = [];
  //   for (let i = 0; i < receivedUserRecipe.length; i++) {
  //     receivedRecipe.push(await this.recipeController.getRecipe(receivedUserRecipe[i].recipeId));
  //   }
  //   return receivedRecipe;
  // };

  // public getUsersPantry = async (userID: number): Promise<Ingredient[]> => {
  //   const userPantry: UserPantry = {
  //     upMembershipId: 0,
  //     userId: userID,
  //     ingredientId: 0,
  //     ingredientAmount: '',
  //   };
  //   const receivedUserPantry: UserPantry[] = await this.userPantryRepo.getByUserId(userPantry);
  //   const receivedIngredients: Ingredient[] = [];
  //   for (let i = 0; i < receivedUserPantry.length; i++) {
  //     receivedIngredients.push(await this.ingredientController.getIngredient(receivedUserPantry[i].ingredientId));
  //   }
  //   return receivedIngredients;
  // };
}
