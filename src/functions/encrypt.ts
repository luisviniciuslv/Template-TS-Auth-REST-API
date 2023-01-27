import bcrypt from 'bcrypt';

export const encryptStr = (text: string): Promise<string> =>
  bcrypt.hash(text, 5);

export const comparePlainText = (
  text: string,
  hash: string
): Promise<boolean> => bcrypt.compare(text, hash);
