/**
 * Handles Registering the user
 */
import {Invite} from './models/invite';
import {Observable} from 'rxjs';

export interface SipService {
  /**
   * Registers handler for invite events.
   *
   * @param {(sdp: Invite) => void} callback - callback to process the sdp
   */
  readonly invite$: Observable<Invite>;

  /**
   * Registers the given client with the sip registrar,
   * and returns a promise which resolves when registered, and rejects on failure.
   *
   * @return {Promise} promise
   */
  registerClient(): Promise<any>;

  /**
   * Unregisters the given client.
   * and returns a promise which resolves when unregistered.
   *
   * @return {Promise} promise
   */
  unregisterClient(): Promise<any>;
}
