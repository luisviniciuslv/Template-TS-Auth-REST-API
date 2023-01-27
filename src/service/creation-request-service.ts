import { CreationRequestRepository } from '../repository/creation-request-repository';
import sgMail from '@sendgrid/mail';
import { SENDGRID_API_KEY } from '../constants/sendgrid_api_key';
import { CreationRequestAlreadyExistsException } from '../exceptions/creation-request-already-exists';
import { CreationRequestNotExistsException } from '../exceptions/creation-request-not-exists';
import { CreationRequestCodeErrorException } from '../exceptions/creation-request-code-error';
import { UserRepository } from '../repository/user-repository';
import { UserAlreadyExistsException } from '../exceptions/user-already-exists';
import { encryptStr } from '../functions/encrypt';
import { UserDocument } from '../documents/user';
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
      throw new CreationRequestAlreadyExistsException(
        'Creation request already exists'
      );
    }
    const code: string = this.generateCode();
    this.creationRequestRepository.create({ email, code });
    this.sendEmail(email, code);
  }

  private generateCode(): string {
    return String(Math.floor(1000 + Math.random() * 9000).toString());
  }
  private sendEmail(email: string, code: string) {
    sgMail.setApiKey(SENDGRID_API_KEY);
    const body = {
      to: email,
      from: 'luis.silva520@aluno.unip.br',
      subject: 'Sending with SendGrid is Fun',
      text:
        'you code is: ' + code + ' and easy to do anywhere, even with Node.js',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>'
    };
    sgMail
      .send(body)
      .then((result) => {
        // eslint-disable-next-line no-console
        console.log('Email enviado');
        // eslint-disable-next-line no-console
        console.log(result);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);

        if (error.response) {
          // eslint-disable-next-line no-console
          console.error(error.response.body);
        }
      });
  }
}
