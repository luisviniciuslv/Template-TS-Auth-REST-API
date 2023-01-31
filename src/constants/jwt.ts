import dotenv from 'dotenv';
dotenv.config();

let JWT_SECRET = '';
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
} else {
  JWT_SECRET = process.env.JWT_SECRET;
}
export default JWT_SECRET;
