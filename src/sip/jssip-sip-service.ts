import {
  RegisteredEvent,
  UAConfiguration,
  UnRegisteredEvent,
} from 'jssip/lib/UA';
import {SipService} from './sip-service';
import {NodeUa} from "./node-ua";
import {Invite} from "./models/invite";
import {Observable, Subject, Subscription} from "rxjs";
const NodeWebSocket = require('jssip-node-websocket');

/**
 * Handles sip
 */
export class JssipSipService implements SipService {
  readonly invite$: Observable<Invite>;

  private userAgent: NodeUa | undefined;
  private inviteSubject: Subject<Invite>;
  private inviteSubscription: Subscription | undefined;

  /**
   * Constructor
   * @param {string} server - sip domain
   * @param {string} user - sip endpoint username
   * @param {string} password - sip endpoint password
   */
  constructor(private server: string, private user: string, private password: string) {
    this.inviteSubject = new Subject<Invite>();
    this.invite$ = this.inviteSubject.asObservable();
  }

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
      this.userAgent = new NodeUa(configuration);
      this.inviteSubscription = this.userAgent.invite$.subscribe(this.inviteSubject.next);
      this.userAgent.on('registered', (event: RegisteredEvent) => resolve(event));
      this.userAgent.on(
          'registrationFailed',
          (event: UnRegisteredEvent) => reject(event),
      );

      this.userAgent.start();
      process.on('exit', () => this.unregisterClient());
    });
  }

  /**
   * Unregisters the given client.
   * and returns a promise which resolves when unregistered.
   *
   * @return {Promise<UnRegisteredEvent>} promise
   */
  unregisterClient(): Promise<UnRegisteredEvent> {
    return new Promise<UnRegisteredEvent>((resolve) => {
      this.inviteSubscription?.unsubscribe();
      this.userAgent?.on('unregistered', (event: RegisteredEvent) => resolve(event));
      this.userAgent?.unregister();
    });
  }
}
