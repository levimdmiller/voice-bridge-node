import {AppService} from 'matrix-appservice';

/**
 * Handles matrix interactions
 */
export class MatrixService {
  private appService: AppService;

  /**
   * Constructor.
   * @param {string} homeserverToken - homeserver token
   * @param {number} httpMaxSizeBytes - max request size
   * @param {number} port - port to listen to
   */
  constructor(
    private homeserverToken: string,
    private httpMaxSizeBytes: number,
    private port: number,
  ) {}

  /**
   * Sets up application service
   */
  async setup(): Promise<void> {
    this.appService = new AppService({
      httpMaxSizeBytes: this.httpMaxSizeBytes,
      homeserverToken: this.homeserverToken,
    });
    await this.appService.listen(this.port, undefined, undefined);
  }
}
