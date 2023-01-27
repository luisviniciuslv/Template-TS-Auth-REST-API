export class CreationRequestAlreadyExistsException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CreationRequestAlreadyExistsException';
  }
}
