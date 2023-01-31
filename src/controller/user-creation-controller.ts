import { Request, Response, Router } from 'express';
import { Service } from '../service/user-service';
import { CreationRequestAlreadyExistsException } from '../exceptions/creation-request-already-exists';
import { CreationRequestNotExistsException } from '../exceptions/creation-request-not-exists';
import { CreationRequestCodeErrorException } from '../exceptions/creation-request-code-error';
import { UserAlreadyExistsException } from '../exceptions/user-already-exists';
import {
  validateCodePayload,
  validateUserLoginPayload
} from './validations/user-creation';
import {
  generate as generateJwt,
  verifyJWT as validateJwt
} from '../functions/jwt';
import { AcessTokenException } from '../exceptions/acess-token-exception';
import { userLoginDto } from './dto/user-login-dto';
import { InvalidPayloadException } from '../exceptions/invalid-payload-exception';
import { validateSearchParams } from './validations/user-search';
import { UserNotFoundException } from '../exceptions/user-not-found-exception';
import { InvalidSearchParamsExeption } from '../exceptions/invalid-search-params';

export class UserCreationController {
  private _router = Router();
  private creationRequestService = new Service();
  public get router() {
    return this._router;
  }

  constructor() {
    this._router.post('/creationRequest', this.creationRequest);
    this._router.post('/verifyCodeCreation', this.verifyCode);
    this._router.post('/login', this.login);
    this._router.get('/:id', validateJwt, this.getUserById);
  }

  private getUserById = async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
      validateSearchParams({ id });
      const user = await this.creationRequestService.getUserById(id);
      res.status(200).send(user);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        res.status(404).send(error.message);
      }
      if (error instanceof InvalidSearchParamsExeption) {
        res.status(400).send(error.message);
      }
    }
  };

  private login = async (req: Request, res: Response) => {
    const userCredentials: userLoginDto = req.body;
    try {
      validateUserLoginPayload(userCredentials);
      const userLoginResult = await this.creationRequestService.executeLogin(
        userCredentials.email,
        userCredentials.password
      );
      if (userLoginResult) {
        generateJwt(userCredentials.email, (error, jwtToken) => {
          if (error != null) {
            throw new AcessTokenException('Could not generate JWT token');
          } else {
            res.status(200).send({ accessToken: jwtToken });
          }
        });
      } else {
        res.sendStatus(400);
      }
    } catch (error) {
      if (error instanceof InvalidPayloadException) {
        res.status(500).send(error.message);
        return;
      } else {
        res.status(500).send('Internal Server Error');
      }
    }
  };

  private creationRequest = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send('Email or password is required');
    }

    try {
      await this.creationRequestService.createCreationRequest(email, password);
      return res.sendStatus(200);
    } catch (error) {
      if (
        error instanceof CreationRequestAlreadyExistsException ||
        error instanceof UserAlreadyExistsException
      ) {
        return res.status(409).send(error.message);
      }
      res.status(500).send(error.message);
    }
  };

  private verifyCode = async (req: Request, res: Response) => {
    try {
      validateCodePayload(req.body);
      const { email, code } = req.body;
      await this.creationRequestService.verifyCodeAndCreateAccount(email, code);
      return res.sendStatus(200);
    } catch (error) {
      if (
        error instanceof CreationRequestNotExistsException ||
        error instanceof CreationRequestCodeErrorException
      ) {
        return res.status(400).send(error.message);
      }
      return res.status(500).send(error.message);
    }
  };
}
