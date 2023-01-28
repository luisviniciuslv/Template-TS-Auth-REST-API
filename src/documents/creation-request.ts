import { Document, ObjectId } from 'mongoose';

export interface CreationRequestDocument extends Document {
  _id: ObjectId;
  email: string;
  password: string;
  code: string;
  created_at: Date;
}
