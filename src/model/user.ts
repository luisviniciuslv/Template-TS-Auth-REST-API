import { model, Schema } from 'mongoose';
import { UserDocument } from '../documents/user';
import { user_schema } from '../constants/schemas/user_schema';

export const UserSchema = new Schema(user_schema);
const User = model<UserDocument>('user', UserSchema);
export default User;
