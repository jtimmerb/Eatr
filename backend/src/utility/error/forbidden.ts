/**  */
import HttpError from './httpError';

export default class Forbidden extends HttpError {
  constructor(message: string) {
    super(403, message);

    // set prototype explicitly
    Object.setPrototypeOf(this, Forbidden.prototype);
  }
}
