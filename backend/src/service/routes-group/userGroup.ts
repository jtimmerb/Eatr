import {RequestHandler} from 'express';

import RoutesGroup from './routesGroup';
import UserController from '../../biz/user-controller/user-controller';

import {User} from '../../data/users/entity';

export default class UserGroup extends RoutesGroup {
  private userController: UserController;

  constructor(userController: UserController) {
    super();
    this.userController = userController;
  }

  public init(): void {
    this.getRouter().post('/', this.createUserHandler());
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
}
