export class AuthenticationError extends Error {
  constructor(public errorCode: string, message: string) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.errorCode = errorCode;
  }
}
