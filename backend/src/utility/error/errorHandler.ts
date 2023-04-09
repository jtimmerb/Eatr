import {Request, Response, NextFunction, ErrorRequestHandler, RequestHandler} from 'express';

import HttpError from './httpError';
import InternalServer from './internalServer';

export default abstract class ErrorHandler {
  public static errorHandler: RequestHandler = async (req, res, next) => {
    try {
      await next();
    } catch (err) {
      console.error(err);
      if (err instanceof HttpError) {
        res.status(err.getCode()).send(err.serialize());
      } else {
        const serverError = new InternalServer();
        res.status(serverError.getCode()).send(serverError.serialize());
      }
    }
  };
}
