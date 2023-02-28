import {RequestHandler} from 'express';

import RoutesGroup from './routesGroup';
import UserController from '../../biz/user-controller/user-controller';

export default class UserGroup extends RoutesGroup {
  public init(): void {
    this.getRouter().get('/:userID', this.getUserHandler());
  }

  private getUserHandler() {
    const handler: RequestHandler = async (req, res, next) => {
      res.send('get user id endpoint');
    };
    return handler;
  }
}
