"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Base error class used for throwing HTTP errors */
class HttpError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
        this.message = message;
        // set prototype explicitly
        Object.setPrototypeOf(this, HttpError.prototype);
    }
    getCode() {
        return this.code;
    }
    // Serialize the error into an API response
    serialize() {
        return {
            statusCode: this.code,
            message: this.message,
        };
    }
}
exports.default = HttpError;
