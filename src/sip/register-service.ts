import { RegisteredEvent, UAConfiguration, UnRegisteredEvent } from "jssip/lib/UA";
import { UA } from "jssip";
const NodeWebSocket = require('jssip-node-websocket');


export class RegisterService {
  private userAgent: UA | undefined;

  constructor(private server: string, private user: string, private password: string) {}

  /**
   * Registers the given client with the sip registrar,
   * and returns a promise which resolves when registered, and rejects on failure.
   */
  registerClient(): Promise<RegisteredEvent | UnRegisteredEvent> {
    const socket = new NodeWebSocket(`wss://${this.server}`);
    const configuration: UAConfiguration = {
      sockets: [ socket ],
      uri: `sip:${this.user}@${this.server}`,
      password: this.password
    };

    return new Promise<RegisteredEvent | UnRegisteredEvent>((resolve, reject) => {
      this.userAgent = new UA(configuration);
      this.userAgent.on('registered', (event: RegisteredEvent) => resolve(event));
      this.userAgent.on('registrationFailed', (event: UnRegisteredEvent) => reject(event));
      this.userAgent.start();
      process.on('exit', () => this.unregisterClient());
    });
  }

  /**
   * Unregisters the given client.
   * and returns a promise which resolves when unregistered.
   */
  unregisterClient(): Promise<UnRegisteredEvent> {
    return new Promise<UnRegisteredEvent>((resolve) => {
      this.userAgent?.on('unregistered', (event: RegisteredEvent) => resolve(event));
      this.userAgent?.unregister();
    });
  }
}