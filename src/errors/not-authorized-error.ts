import { CustomError } from './custom-error';

export class NotAuthorizedError extends CustomError {
    statusCode = 401;
  
    constructor(public message: string, public field?: string) {
      super(message);
      Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    }
  
    serializeErrors() {
      return [{ message: this.message, field: this.field }];
    }
  }