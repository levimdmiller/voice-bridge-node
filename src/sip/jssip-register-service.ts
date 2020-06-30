import {
  RegisteredEvent,
  UAConfiguration,
  UnRegisteredEvent,
} from 'jssip/lib/UA';
import {UA} from 'jssip';
import {RegisterService} from './register-service';
const NodeWebSocket = require('jssip-node-websocket');

/**
 * Handles
 */
export class JssipRegisterService implements RegisterService {
  private userAgent: UA | undefined;

  /**
   * Constructor
   * @param {string} server - sip domain
   * @param {string} user - sip endpoint username
   * @param {string} password - sip endpoint password
   */
  constructor(private server: string, private user: string, private password: string) {}

  /**
   * Registers the given client with the sip registrar,
   * and returns a promise which resolves when registered, and rejects on failure.
   *
   * @return {Promise<RegisteredEvent | UnRegisteredEvent>} promise
   */
  registerClient(): Promise<RegisteredEvent | UnRegisteredEvent> {
    const socket = new NodeWebSocket(`wss://${this.server}`);
    const configuration: UAConfiguration = {
      sockets: [socket],
      uri: `sip:${this.user}@${this.server}`,
      password: this.password,
    };

    return new Promise<RegisteredEvent | UnRegisteredEvent>((resolve, reject) => {
      this.userAgent = new UA(configuration);
      this.userAgent.on('registered', (event: RegisteredEvent) => resolve(event));
      this.userAgent.on(
          'registrationFailed',
          (event: UnRegisteredEvent) => reject(event),
      );

      this.userAgent.on('newRTCSession', (data: any) => this.test(data));

      this.userAgent.start();
      process.on('exit', () => this.unregisterClient());
    });
  }

  test(event: any): void {
    console.log('********', event);
  }

  /**
   * Unregisters the given client.
   * and returns a promise which resolves when unregistered.
   *
   * @return {Promise<UnRegisteredEvent>} promise
   */
  unregisterClient(): Promise<UnRegisteredEvent> {
    return new Promise<UnRegisteredEvent>((resolve) => {
      this.userAgent?.on('unregistered', (event: RegisteredEvent) => resolve(event));
      this.userAgent?.unregister();
    });
  }
}
