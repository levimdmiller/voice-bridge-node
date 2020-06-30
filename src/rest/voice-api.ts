import {RestApi} from "./rest-api";
import {Express, Request, Response} from "express";
const { RestClient } = require('@signalwire/node');

export class VoiceApi implements RestApi {
  private readonly baseApi: string = '/voice';

  setup(app: Express): void {
    app.post(this.baseApi, this.handlePost);
  }

  handlePost(reqest: Request, response: Response) {
    // const { From, To } = request.body;
    const laml = new RestClient.LaML.VoiceResponse();

    const dial = laml.dial();
    dial.sip('sip:+17784004339@levimiller-matrixbridge.sip.signalwire.com');
    console.log(laml.toString());

    response.writeHead(200, {'Content-Type': 'text/xml'});
    response.end(laml.toString());
  }
}
