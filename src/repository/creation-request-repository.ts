import CreationRequest from '../model/creation-request';
import { CreationRequestDocument } from '../documents/creation-request';

export class CreationRequestRepository {
  async create(creationRequest): Promise<CreationRequestDocument> {
    return new CreationRequest(creationRequest).save();
  }
  public findByEmail = (email: string) =>
    CreationRequest.findOne({ email }).exec();

  public deleteByEmail = (email: string) =>
    CreationRequest.findOneAndRemove({ email }).exec();
}
