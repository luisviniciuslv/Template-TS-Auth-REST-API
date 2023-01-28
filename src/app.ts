import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Application } from 'express';
import mongoose from 'mongoose';
import dbConsts from './constants/database';
import { UserCreationController } from './controller/user-creation-controller';
import { DatabaseUriNotFoundException } from './exceptions/database-uri-not-found-exception';

export class App {
  private _server: Application;
  public get server() {
    return this._server;
  }

  constructor() {
    this._server = express();
    this.setConfig();
    this.setControllers();
    this.setMongoConnection();
  }

  private setConfig() {
    this._server.use(bodyParser.json({ limit: '50mb' }));
    this._server.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    this._server.use(cors());
  }

  private setControllers() {
    const userCreationController = new UserCreationController();
    this._server.use('/user', userCreationController.router);
  }

  private async setMongoConnection() {
    mongoose.Promise = global.Promise;
    try {
      if (!dbConsts.DATABASE_ADDRESS) {
        throw new DatabaseUriNotFoundException(
          'missing environment variable [MONGO_CONNECTION_URI]'
        );
      }
      mongoose.set('strictQuery', true);
      const server = await mongoose.connect(
        `${dbConsts.DATABASE_ADDRESS}/Portifolio`
      );
      // eslint-disable-next-line no-console
      console.log(
        `[MongoDB Connection] server.connection.name: ${server.connection.name}`
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Could not connect into MongoDB, error: ', error);
      process.exit();
    }
  }
}
