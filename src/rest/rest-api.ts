import {Express} from "express";

export interface RestApi {
  /**
   * sets up rest apis on the given app.
   * @param app {Express} - app to configure
   */
  setup(app: Express): void;
}
