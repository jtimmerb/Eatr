import HttpError from './httpError';

export default class BadRequest extends HttpError {
  constructor(message: string) {
    super(400, message);

    // set prototype explicitly
    Object.setPrototypeOf(this, BadRequest.prototype);
  }
}
