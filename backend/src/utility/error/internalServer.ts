import HttpError from './httpError';

export default class InternalServer extends HttpError {
  constructor() {
    super(500, 'Internal Server Error');
    Object.setPrototypeOf(this, InternalServer.prototype);
  }
}
