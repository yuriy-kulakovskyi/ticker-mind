export class NotificationEntity {
  constructor(
    public id: string,
    public title: string,
    public tickers: string[],
    public message: string,
    public subscriberId: string,
    public createdAt: Date,
  ) {}
}