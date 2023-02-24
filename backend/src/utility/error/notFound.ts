/**  */
import HttpError from './httpError';

export default class NotFound extends HttpError {
  constructor(value: string, field = 'ID') {
    const message = `No object could be found for given ${field}: '${value}'`;
    super(404, message);

    // set prototype explicitly
    Object.setPrototypeOf(this, NotFound.prototype);
  }
}
