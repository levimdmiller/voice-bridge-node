/**
 * Handles Registering the user
 */
export interface RegisterService {
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
