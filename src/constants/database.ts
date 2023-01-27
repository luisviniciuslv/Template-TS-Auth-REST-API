import dotenv from 'dotenv';
dotenv.config();

const DATABASE_ADDRESS = process.env.DATABASE_ADDRESS;

export default {
  DATABASE_ADDRESS
};