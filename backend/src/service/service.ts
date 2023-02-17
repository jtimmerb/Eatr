import {Application} from 'express';
import UserRepo from '../data/users/repo';
import RecipeRepo from '../data/recipes/repo';

interface Service {
  listen(port: number): void;
}

export default class EatrService implements Service {
  private app: Application;
  public userRepo: UserRepo;
  public recipeRepo: RecipeRepo;

  constructor(app: Application, psql: any) {
    this.app = app;
    this.userRepo = new UserRepo(psql);
    this.recipeRepo = new RecipeRepo(psql);
  }

  public listen(port: number): void {
    this.app.listen(port, () => console.log('Server running'));
  }
}
