import {UA} from 'jssip';
import {Observable, Subject} from 'rxjs';
import {Invite} from './models/invite';
import {IncomingRequest} from 'jssip/lib/SIPMessage';

/**
 * UA that works in node.
 */
export class NodeUa extends UA {
  private inviteSubject: Subject<Invite> = new Subject<Invite>();

  /**
   * Invite observable
   */
  public get invite$(): Observable<Invite> {
    return this.inviteSubject.asObservable();
  }

  /**
   * Overrides the UA receiveRequest method which
   * doesn't work in nodejs since it has calls to window.
   *
   * We only need it for forwarding messages to matrix anyways.
   * @param {IncomingRequest} request - incoming message
   */
  receiveRequest(request: IncomingRequest) {
    console.debug(request);
    if (request.method === 'INVITE') {
      this.inviteSubject.next({
        to: request.to.display_name,
        from: request.from.display_name,
        sdp: request.body,
      });
    }
  }
}
