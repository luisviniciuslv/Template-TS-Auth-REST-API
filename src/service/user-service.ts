import { CreationRequestRepository } from '../repository/creation-request-repository';
import { CreationRequestNotExistsException } from '../exceptions/creation-request-not-exists';
import { CreationRequestCodeErrorException } from '../exceptions/creation-request-code-error';
import { UserRepository } from '../repository/user-repository';
import { UserAlreadyExistsException } from '../exceptions/user-already-exists';
import { comparePlainText, encryptStr } from '../functions/encrypt';
import { sendEmail } from '../functions/nodemailer';
import { UserNotFoundException } from '../exceptions/user-not-found-exception';

export class Service {
  private creationRequestRepository = new CreationRequestRepository();
  private userRepository = new UserRepository();

  public async getUserById(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundException(`User not found: ${id}`);
    }

    return user;
  }

  public async executeLogin(email: string, password: string) {
    const foundUser = await this.userRepository.findByEmail(email);
    if (!foundUser) {
      throw new Error('Invalid e-mail or password!');
    }

    const isValidPassword = await comparePlainText(
      password,
      foundUser.password
    );
    return isValidPassword;
  }

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
    await this.userRepository.create({ email, password });
  }

  public async createCreationRequest(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
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
