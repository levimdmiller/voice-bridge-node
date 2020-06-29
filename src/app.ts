import express from 'express';
import {RegisterService, WebsocketRegisterService} from './sip';

const app = express();
const port = 8080; // default port to listen

// start the Express server
app.listen(port, async () => {
  console.log( `server started at http://localhost:${ port }` );

  const registerService: RegisterService = new WebsocketRegisterService(
      'levimiller-matrixbridge.sip.signalwire.com',
      '+17784004339',
      'demodemo',
  );
  try {
    const result = await registerService.registerClient();
    console.log('Registered: ', result);
  } catch (e) {
    console.log('Error registering: ', e);
  }
} );

// catches ctrl+c event
process.on('SIGINT', process.exit);

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', process.exit);
process.on('SIGUSR2', process.exit);

// catches uncaught exceptions
process.on('uncaughtException', process.exit);
