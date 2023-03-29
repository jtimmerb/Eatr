import {Application, RequestHandler, Router} from 'express';
import Ajv, {JSONSchemaType} from 'ajv';

import BadRequest from '../../utility/error/badRequest';

export default class RoutesGroup {
  private router: Router;
  private ajv: Ajv;

  constructor() {
    this.router = Router();
    this.ajv = new Ajv();
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

  public validateSchema(schema: JSONSchemaType<any>, data: any): void {
    const validate = this.ajv.compile(schema);
    if (validate(data)) {
      console.log('valid');
    } else {
      console.log('not valid');
      throw new BadRequest(JSON.stringify(validate.errors));
    }
  }
}
