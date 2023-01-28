import { Request, Response, Router } from 'express';
import { CreationRequestService } from '../service/creation-request-service';
import { CreationRequestAlreadyExistsException } from '../exceptions/creation-request-already-exists';
import { CreationRequestNotExistsException } from '../exceptions/creation-request-not-exists';
import { CreationRequestCodeErrorException } from '../exceptions/creation-request-code-error';
import { UserAlreadyExistsException } from '../exceptions/user-already-exists';
import {
  validateCodePayload,
  validateUserPayload
} from './validations/user-creation';
import { InvalidPayloadException } from '../exceptions/invalid-payload-exception';

export class UserController {
  private _router = Router();
  private creationRequestService = new CreationRequestService();
  public get router() {
    return this._router;
  }

  constructor() {
    this._router.post('/creationRequest', this.creationRequest);
    this._router.post('/verifyCodeCreation', this.verifyCode);
    this._router.post('/createUser', this.createUser);
  }

  private createUser = async (req: Request, res: Response) => {
    const { name, email, password, code } = req.body;
    const user = {
      name,
      email,
      password,
      code
    };

    try {
      validateUserPayload(user);
      await this.creationRequestService.createUser(name, email, password, code);
      return res.status(201).send('User created');
    } catch (error) {
      if (error instanceof CreationRequestNotExistsException) {
        return res.status(400).send(error.message);
      }
      if (error instanceof CreationRequestCodeErrorException) {
        return res.status(400).send(error.message);
      }
      if (error instanceof InvalidPayloadException) {
        return res.status(400).send(error.message);
      }
      return res.status(500).send(error.message);
    }
  };

  private verifyCode = async (req: Request, res: Response) => {
    try {
      validateCodePayload(req.body);
      const { email, code } = req.body;
      await this.creationRequestService.verifyCode(email, code);
    } catch (error) {
      if (error instanceof CreationRequestNotExistsException) {
        return res.status(400).send(error.message);
      }
      if (error instanceof CreationRequestCodeErrorException) {
        return res.status(400).send(error.message);
      }
      if (error instanceof InvalidPayloadException) {
        return res.status(400).send(error.message);
      }
      return res.status(500).send(error.message);
    }
    return res.sendStatus(200);
  };

  private creationRequest = async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).send('Email is required');
    }
    try {
      await this.creationRequestService.createCreationRequest(email);
      return res.sendStatus(200);
    } catch (error) {
      if (error instanceof CreationRequestAlreadyExistsException) {
        return res.status(409).send(error.message);
      }
      if (error instanceof UserAlreadyExistsException) {
        return res.status(409).send(error.message);
      }
      res.status(500).send(error.message);
    }
  };
}
