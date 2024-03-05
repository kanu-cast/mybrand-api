import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom-error';
// Error handling middleware
export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if ('statusCode' in err){
      return res.status(err.statusCode).send({ errors: err.serializeErrors() });
    }else{
      // console.error(err)
      res.status(400).send({ errors: [{ message: 'Something went wrong' }] });
    }
  };