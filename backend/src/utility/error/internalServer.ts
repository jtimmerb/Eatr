import HttpError from './httpError';

export default class InteralServer extends HttpError {
  constructor() {
    super(500, 'Internal Server Error');
    Object.setPrototypeOf(this, InteralServer.prototype);
  }
}
