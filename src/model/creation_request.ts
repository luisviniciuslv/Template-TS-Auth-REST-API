import { model, Schema } from 'mongoose';
import { CreationRequestDocument } from '../documents/creation_request';
import { creation_request_schema } from '../constants/schemas/creation_request_schema';

export const CreationRequestSchema = new Schema(creation_request_schema);
const CreationRequest = model<CreationRequestDocument>(
  'CreationRequest',
  CreationRequestSchema
);

export default CreationRequest;
