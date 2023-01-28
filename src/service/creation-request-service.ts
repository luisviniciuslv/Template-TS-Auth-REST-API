import { CreationRequestRepository } from '../repository/creation-request-repository';
import { CreationRequestAlreadyExistsException } from '../exceptions/creation-request-already-exists';
import { CreationRequestNotExistsException } from '../exceptions/creation-request-not-exists';
import { CreationRequestCodeErrorException } from '../exceptions/creation-request-code-error';
import { UserRepository } from '../repository/user-repository';
import { UserAlreadyExistsException } from '../exceptions/user-already-exists';
import { encryptStr } from '../functions/encrypt';
import { UserDocument } from '../documents/user';
import nodemailer from 'nodemailer';
import { EMAIL_ADRESS, PASSWORD_EMAIL_ADRESS } from '../constants/email';

export class CreationRequestService {
  private creationRequestRepository = new CreationRequestRepository();
  private UserRepository = new UserRepository();

  public async createUser(
    name: string,
    email: string,
    password: string,
    code: string
  ) {
    const creationRequest = await this.creationRequestRepository.findByEmail(
      email
    );

    const user = await this.UserRepository.findByEmail(email);

    if (user) {
      throw new UserAlreadyExistsException('User already exists');
    }

    if (!creationRequest) {
      throw new CreationRequestNotExistsException(
        "Creation request doesn't exists"
      );
    }

    if (creationRequest.code !== code) {
      throw new CreationRequestCodeErrorException('Code is not valid');
    }

    const user_payload = {
      name,
      email,
      password: await encryptStr(password)
    } as UserDocument;

    this.UserRepository.create(user_payload);
    this.creationRequestRepository.deleteByEmail(email);
  }

  public async verifyCode(email: string, code: string) {
    const creationRequest = await this.creationRequestRepository.findByEmail(
      email
    );

    if (!creationRequest) {
      throw new CreationRequestNotExistsException(
        "Creation request doesn't exists"
      );
    }

    if (creationRequest.code !== code) {
      throw new CreationRequestCodeErrorException('Code is not valid');
    }

    return true;
  }

  public async createCreationRequest(email: string) {
    const user = await this.UserRepository.findByEmail(email);

    if (user) {
      throw new UserAlreadyExistsException('User email already exists');
    }

    const creationRequest = await this.creationRequestRepository.findByEmail(
      email
    );

    if (creationRequest) {
      if (creationRequest.created_at > new Date(Date.now() - 60000)) {
        throw new CreationRequestAlreadyExistsException(
          'Creation request already exists'
        );
      }
    }

    const code: string = this.generateCode();
    this.creationRequestRepository.create({ email, code });
    this.sendEmail(email, code);
  }

  private generateCode(): string {
    return String(Math.floor(1000 + Math.random() * 9000).toString());
  }

  private async sendEmail(email: string, code: string) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: EMAIL_ADRESS,
        pass: PASSWORD_EMAIL_ADRESS
      }
    });

    const mailOptions = {
      from: EMAIL_ADRESS,
      to: email,
      subject: 'Seu código para criação de conta',
      text: `Seu código para criar conta é: ${code}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return false;
      } else {
        return info;
      }
    });
  }
}
