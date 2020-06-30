import {RestApi} from './rest-api';
import {Express, Request, Response} from 'express';
const {RestClient} = require('@signalwire/node');

/**
 * Handles setting up /voice/* rest endpoints.
 */
export class VoiceApi implements RestApi {
  private readonly baseApi: string = '/voice';

  /**
   * sets up voice apis
   * @param {Express} app - app to configure
   */
  setup(app: Express): void {
    app.post(this.baseApi, this.handlePost);
  }

  /**
   * Handles posting to the base url.
   * @param {Request} request - post request
   * @param {Response} response - post response
   */
  handlePost(request: Request, response: Response) {
    // const { From, To } = request.body;
    const laml = new RestClient.LaML.VoiceResponse();

    const dial = laml.dial();
    dial.sip('sip:+17784004339@levimiller-matrixbridge.sip.signalwire.com');
    console.log(laml.toString());

    response.writeHead(200, {'Content-Type': 'text/xml'});
    response.end(laml.toString());
  }
}
