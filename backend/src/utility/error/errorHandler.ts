import {Request, Response, NextFunction, ErrorRequestHandler, RequestHandler} from 'express';

import HttpError from './httpError';
import InteralServer from './internalServer';

export default abstract class ErrorHandler {
  public static errorHandler: ErrorRequestHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(error);
    if (error instanceof HttpError) {
      res.status(error.getCode()).send(error.serialize());
    } else if (error.name === 'UnauthorizedError') {
      res.status(401).send(error);
    } else {
      const serverError = new InteralServer();
      res.status(serverError.getCode()).send(serverError.serialize());
    }
  };

  public static errorWrapper = (handler: RequestHandler): RequestHandler => {
    const wrapped: RequestHandler = async (req, res, next) => {
      try {
        await handler(req, res, next);
      } catch (error) {
        next(error);
      }
    };
    return wrapped;
  };
}
