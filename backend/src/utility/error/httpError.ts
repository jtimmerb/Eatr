/** Base error class used for throwing HTTP errors */
export default class HttpError extends Error {
  private code: number;
  message: string;
  constructor(code: number, message: string) {
    super(message);
    this.code = code;
    this.message = message;

    // set prototype explicitly
    Object.setPrototypeOf(this, HttpError.prototype);
  }

  public getCode() {
    return this.code;
  }

  // Serialize the error into an API response
  public serialize() {
    return {
      statusCode: this.code,
      message: this.message,
    };
  }
}
