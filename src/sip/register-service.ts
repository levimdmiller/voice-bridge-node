import { RegisteredEvent, UAConfiguration, UnRegisteredEvent } from "jssip/lib/UA";
import { UA } from "jssip";
const NodeWebSocket = require('jssip-node-websocket');


export class RegisterService {

  /**
   * Registers the given client with the sip registrar,
   * and returns a promise which resolves when registered, and rejects on failure.
   */
  registerClient(server: string, user: string, password: string): Promise<RegisteredEvent | UnRegisteredEvent> {
    const socket = new NodeWebSocket(`wss://${server}`);
    const configuration: UAConfiguration = {
      sockets: [ socket ],
      uri: `sip:${user}@${server}`,
      password: password
    };

    return new Promise<RegisteredEvent | UnRegisteredEvent>((resolve, reject) => {
      const userAgent: UA = new UA(configuration);
      userAgent.on('registered', (event: RegisteredEvent) => resolve(event));
      userAgent.on('registrationFailed', (event: UnRegisteredEvent) => reject(event));
      userAgent.start();
    });
  }
}