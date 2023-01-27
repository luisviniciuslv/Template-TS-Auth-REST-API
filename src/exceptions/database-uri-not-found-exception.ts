export class DatabaseUriNotFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseUriNotFoundException';
  }
}
