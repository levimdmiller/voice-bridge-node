import express, {Express} from 'express';
import {SipService, JssipSipService} from './sip';
import {REST_APIS} from './rest';
import bodyParser from 'body-parser';

const port = 2357; // default port to listen

const app: Express = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies

// start the Express server
app.listen(port, async () => {
  console.log( `server started at http://localhost:${ port }` );

  await register();
});
REST_APIS.forEach((api) => api.setup(app));

/**
 * Temp function that registers user agent.
 */
export async function register() {
  const sipService: SipService = new JssipSipService(
      'levimiller-matrixbridge.sip.signalwire.com',
      '+17784004339',
      'demodemo',
  );
  try {
    await sipService.registerClient();
    console.info('Registered.');
  } catch (e) {
    console.error('Error registering: ', e);
  }
}

// catches ctrl+c event
process.on('SIGINT', process.exit);
