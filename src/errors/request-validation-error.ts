import { CustomError } from './custom-error';

export class RequestValidationError extends CustomError {
    statusCode = 403;
  
    constructor(public message: string, public field?: string) {
      super(message);
      Object.setPrototypeOf(this, RequestValidationError.prototype);
    }
  
    serializeErrors() {
      return [{ message: this.message, field: this.field }];
    }
  }