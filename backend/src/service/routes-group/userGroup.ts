import {RequestHandler} from 'express';

import RoutesGroup from './routesGroup';
import UserController from '../../biz/user-controller/user-controller';
import UserPantryController from '../../biz/userpantry-controller/userpantry-controller';
import UserRecipeController from '../../biz/userrecipe-controller/userrecipe-controller';

import {User} from '../../data/users/entity';

export default class UserGroup extends RoutesGroup {
  private userController: UserController;
  private userPantryController: UserPantryController;
  private userRecipeController: UserRecipeController;

  constructor(
    userController: UserController,
    userPantryController: UserPantryController,
    userRecipeController: UserRecipeController,
  ) {
    super();
    this.userController = userController;
    this.userPantryController = userPantryController;
    this.userRecipeController = userRecipeController;
  }

  public init(): void {
    // create user
    this.getRouter().post('/', this.createUserHandler());

    // get user by id
    this.getRouter().get('/:userId');

    // delete user by id
    this.getRouter().delete('/:userId');

    // add recipe to user's recipe list
    this.getRouter().post('/recipes');

    // add ingredient to user's pantry
    this.getRouter().post('/ingredient');
  }

  private createUserHandler() {
    const handler: RequestHandler = async (req, res, next) => {
      const newUser: User = {
        ...req.body,
      };
      const user = await this.userController.createUser(newUser);
      res.send(user);
    };
    return handler;
  }

  private getUserHandler() {
    const handler: RequestHandler = async (req, res, next) => {
      const userId = req.query.userId;
      if (typeof userId !== 'number') {
        throw Error('query parameter: userId wrong type');
      }

      //const user = await this.userController.getUser(userId);
      //res.send(user);
    };
    return handler;
  }

  private deleteUserHandler() {
    const handler: RequestHandler = async (req, res, next) => {
      const userId = req.query.userId;
      if (typeof userId !== 'number') {
        throw Error('query parameter: userId wrong type');
      }

      await this.userController.deleteUser(userId);
    };
    return handler;
  }

  private addRecipeToUserHandler() {
    const handler: RequestHandler = async (req, res, next) => {};
    return handler;
  }

  private addIngredientToUserHandler() {
    const handler: RequestHandler = async (req, res, next) => {};
    return handler;
  }
}
