import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom-error';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.log('this is erroHandler', err);
  if (res.headersSent) {
    return next(err);
  }
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}