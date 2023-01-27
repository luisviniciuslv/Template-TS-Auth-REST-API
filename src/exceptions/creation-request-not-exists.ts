export class CreationRequestNotExistsException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CreationRequestNotExistsException';
  }
}
