import express from 'express';
import { RegisterService } from "./sip/register-service";

const app = express();
const port = 8080; // default port to listen

// start the Express server
app.listen( port, async () => {
  console.log( `server started at http://localhost:${ port }` );

  const registerService: RegisterService = new RegisterService();
  try {
    const result = await registerService.registerClient(
        'levimiller-matrixbridge.sip.signalwire.com',
        '+17784004339',
        'demodemo'
    );
    console.log('Registered: ', result);
  } catch(e) {
    console.log('Error registering: ', e)
  }
} );
