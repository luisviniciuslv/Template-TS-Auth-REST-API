import User from '../model/user';
import { UserDocument } from '../documents/user';

export class UserRepository {
  async create(user): Promise<UserDocument> {
    return new User(user).save();
  }
  public findByEmail = (email: string) => User.findOne({ email }).exec();
}
