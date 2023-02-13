import {Application} from 'express';
import UserRepo from '../data/users/repo';

interface Service {
  listen(port: number): void;
}

export default class EatrService implements Service {
  private app: Application;
  public userRepo: UserRepo;

  constructor(app: Application, mysqldb: any) {
    this.app = app;
    this.userRepo = new UserRepo(mysqldb);
  }

  public listen(port: number): void {
    this.app.listen(port, () => console.log('Server running'));
  }
}
