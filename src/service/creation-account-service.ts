import { CreationRequestRepository } from '../repository/creation-request-repository';
import { CreationRequestNotExistsException } from '../exceptions/creation-request-not-exists';
import { CreationRequestCodeErrorException } from '../exceptions/creation-request-code-error';
import { UserRepository } from '../repository/user-repository';
import { UserAlreadyExistsException } from '../exceptions/user-already-exists';
import { encryptStr } from '../functions/encrypt';
import { sendEmail } from '../functions/nodemailer';

export class CreationRequestService {
  private creationRequestRepository = new CreationRequestRepository();
  private UserRepository = new UserRepository();

  public async verifyCodeAndCreateAccount(email: string, code: string) {
    const creationRequest = await this.creationRequestRepository.findByEmail(
      email
    );

    if (!creationRequest) {
      throw new CreationRequestNotExistsException(
        "Creation account request doesn't exists"
      );
    }

    if (creationRequest.code !== code) {
      throw new CreationRequestCodeErrorException('Code is not valid');
    }

    await this.creationRequestRepository.deleteByEmail(email);
    const password = creationRequest.password;
    await this.UserRepository.create({ email, password });
  }

  public async createCreationRequest(email: string, password: string) {
    const user = await this.UserRepository.findByEmail(email);
    password = await encryptStr(password);
    if (user) {
      throw new UserAlreadyExistsException('User email already exists');
    }

    const creationRequest = await this.creationRequestRepository.findByEmail(
      email
    );

    if (creationRequest) {
      await this.creationRequestRepository.deleteByEmail(email);
    }

    const code: string = this.generateCode();
    await this.creationRequestRepository.create({ email, password, code });
    await sendEmail(email, code);
  }

  private generateCode(): string {
    return String(Math.floor(1000 + Math.random() * 9000).toString());
  }
}
