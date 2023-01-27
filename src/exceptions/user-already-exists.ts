export class UserAlreadyExistsException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserAlreadyExistsException';
  }
}
