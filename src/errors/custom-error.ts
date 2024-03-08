export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(public message: string, public field?: string) {
    super(message)
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): { message: string; field?: string }[];
}