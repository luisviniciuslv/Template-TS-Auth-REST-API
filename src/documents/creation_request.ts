import { Document, ObjectId } from 'mongoose';

export interface CreationRequestDocument extends Document {
  _id?: ObjectId;
  email: string;
  code: string
}