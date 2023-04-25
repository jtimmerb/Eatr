import {User} from '../../data/users/entity';
import UserRepo from '../../data/users/repo';
import BadRequest from '../../utility/error/badRequest';
import NotFound from '../../utility/error/notFound';

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

    // Verify no users exist with this username
    if (await this.existUserByName(userName)) throw new BadRequest('User already exists with this name');

    const newUser = await this.repo.create(user);
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
    const user = await this.repo.getById(userId);
    return user;
  };

  public getUsersByName = async (userName: string): Promise<User[]> => {
    const users: User[] = await this.repo.getbyName(userName);
    return users;
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
