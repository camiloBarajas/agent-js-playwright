export const mockedDate = Date.now();

export class RPClientMock {
  private config: any;

  constructor(config: any) {
    this.config = config;
  }

  public startLaunch = () => ({
    promise: Promise.resolve('ok'),
    tempId: 'tempLaunchId',
  });

  public finishLaunch = () => ({
    promise: Promise.resolve('ok'),
  });

  public startTestItem = () => ({
    promise: Promise.resolve('ok'),
    tempId: 'tempTestItemId',
  });

  public finishTestItem = () => ({
    promise: Promise.resolve('ok'),
  });

  public sendLog = () => ({
    promise: Promise.resolve('ok'),
  });

  public checkConnect = () => ({
    promise: Promise.resolve('ok'),
  });
}