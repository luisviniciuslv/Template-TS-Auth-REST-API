export class AcessTokenException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AcessTokenException';
  }
}
