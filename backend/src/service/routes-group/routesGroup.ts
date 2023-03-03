import {Application, Router} from 'express';

export default class RoutesGroup {
  private router: Router;

  constructor() {
    this.router = Router();
  }

  public init(): void {
    console.log('Init' + this.getRouter());
  }

  public getRouter(): Router {
    return this.router;
  }

  /** Mount the router to the application */
  public mount(prefix: string, app: Application): void {
    this.init();
    app.use(prefix, this.router);
  }
}
