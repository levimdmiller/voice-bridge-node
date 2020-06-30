import {Express} from 'express';

export interface RestApi {
  /**
   * sets up rest apis on the given app.
   * @param {Express} app - app to configure
   */
  setup(app: Express): void;
}
