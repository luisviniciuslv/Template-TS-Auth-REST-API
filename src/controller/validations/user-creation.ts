import { userRequestDto } from '../dto/user-creation-dto';
import { InvalidPayloadException } from '../../exceptions/invalid-payload-exception';
import * as EmailValidator from 'email-validator';
import { codeVerifyRequestDto } from '../dto/code-verify-dto';

const USER_REQUIRED_FIELDS = ['name', 'email', 'password', 'code'];
const CODE_REQUIRED_FIELDS = ['email', 'code'];

export const validateUserPayload = (user: userRequestDto) => {
  for (let i = 0; i < USER_REQUIRED_FIELDS.length; i++) {
    if (!user[USER_REQUIRED_FIELDS[i]]?.trim()) {
      throw new InvalidPayloadException(
        `Invalid payload: field ${USER_REQUIRED_FIELDS[i]} should be informed!`
      );
    }
  }
  if (!EmailValidator.validate(user.email)) {
    throw new InvalidPayloadException('Invalid payload: invalid e-mail!');
  }
};
export const validateCodePayload = (payload: codeVerifyRequestDto) => {
  for (let i = 0; i < CODE_REQUIRED_FIELDS.length; i++) {
    if (!payload[CODE_REQUIRED_FIELDS[i]]?.trim()) {
      throw new InvalidPayloadException(
        `Invalid payload: field ${CODE_REQUIRED_FIELDS[i]} should be informed!`
      );
    }
  }
};
