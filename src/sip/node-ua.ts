import {UA} from "jssip";
import {Observable, Subject} from "rxjs";
import {Invite} from "./models/invite";
import {IncomingRequest} from "jssip/lib/SIPMessage";

export class NodeUa extends UA {
  private inviteSubject: Subject<Invite> = new Subject<Invite>();

  public readonly invite$: Observable<Invite> = this.inviteSubject.asObservable();

  receiveRequest(request: IncomingRequest) {
    console.debug(request);
    if (request.method === 'INVITE') {
      this.inviteSubject.next({
        to: request.to.display_name,
        from: request.from.display_name,
        sdp: request.body
      });
    }
  }
}