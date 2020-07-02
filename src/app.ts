import express, {Express} from 'express';
import {SipService, JssipSipService} from './sip';
import {REST_APIS} from './rest';
import bodyParser from 'body-parser';
import config from 'config';
import {MatrixService} from './matrix/matrix-service';

const port = 2357; // default port to listen

const app: Express = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies

// start the Express server
app.listen(port, async () => {
  console.log( `server started at http://localhost:${ port }` );

  await register();
  await startAppService();
});
REST_APIS.forEach((api) => api.setup(app));

/**
 * Registers user agent.
 */
async function register() {
  const sipService: SipService = new JssipSipService(
      config.get('sip.signal-wire.server'),
      config.get('sip.signal-wire.user'),
      config.get('sip.signal-wire.password'),
  );
  try {
    await sipService.registerClient();
    process.on('exit', sipService.unregisterClient);
    console.info('Registered.');
  } catch (e) {
    console.error('Error registering: ', e);
  }
}

/**
 * Starts app service
 */
async function startAppService() {
  const appService: MatrixService = new MatrixService(
      config.get('matrix.app-server.port'),
      config.get('matrix.app-server.hsToken'),
      config.get('matrix.app-server.httpMaxSizeBytes'),
  );
  await appService.setup();
}

// catches ctrl+c event
process.on('SIGINT', process.exit);
