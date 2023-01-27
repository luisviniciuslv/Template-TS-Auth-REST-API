export class CreationRequestCodeErrorException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CreationRequestCodeErrorException';
  }
}
