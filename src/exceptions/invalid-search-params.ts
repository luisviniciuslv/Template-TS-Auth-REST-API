export class InvalidSearchParamsExeption extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidSearchParamsExeption';
  }
}
