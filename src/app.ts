import express, {Express} from 'express';
import {RegisterService, JssipRegisterService} from './sip';
import {REST_APIS} from './rest';
import bodyParser from 'body-parser';

const port = 2357; // default port to listen

const app: Express = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies

// start the Express server
app.listen(port, async () => {
  console.log( `server started at http://localhost:${ port }` );

  await registerService();
});
REST_APIS.forEach((api) => api.setup(app));

/**
 * Temp function that registers user agent.
 */
export async function registerService() {
  const registerService: RegisterService = new JssipRegisterService(
      'levimiller-matrixbridge.sip.signalwire.com',
      '+17784004339',
      'demodemo',
  );
  try {
    const result = await registerService.registerClient();
    console.info('Registered: ', result);
  } catch (e) {
    console.error('Error registering: ', e);
  }
}

// catches ctrl+c event
process.on('SIGINT', process.exit);
