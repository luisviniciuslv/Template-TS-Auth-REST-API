import { Document, ObjectId } from 'mongoose';

export interface UserDocument extends Document {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  message: string;
}
