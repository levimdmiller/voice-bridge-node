import {AppService} from "matrix-appservice";

export class MatrixService {
  private appService: AppService;
  constructor(private homeserverToken: string) {}

  async setup(): Promise<void> {
    this.appService = new AppService({
      httpMaxSizeBytes: 5000000,
      homeserverToken: this.homeserverToken
    });
    await this.appService.listen(1113, undefined, undefined);
  }
}
