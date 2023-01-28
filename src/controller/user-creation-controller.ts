import { Request, Response, Router } from 'express';
import { CreationRequestService } from '../service/creation-account-service';
import { CreationRequestAlreadyExistsException } from '../exceptions/creation-request-already-exists';
import { CreationRequestNotExistsException } from '../exceptions/creation-request-not-exists';
import { CreationRequestCodeErrorException } from '../exceptions/creation-request-code-error';
import { UserAlreadyExistsException } from '../exceptions/user-already-exists';
import { validateCodePayload } from './validations/user-creation';

export class UserCreationController {
  private _router = Router();
  private creationRequestService = new CreationRequestService();
  public get router() {
    return this._router;
  }

  constructor() {
    this._router.post('/creationRequest', this.creationRequest);
    this._router.post('/verifyCodeCreation', this.verifyCode);
  }

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
