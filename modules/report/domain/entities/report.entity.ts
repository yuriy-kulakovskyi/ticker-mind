export class ReportEntity {
  constructor(
    public id: string,
    public title: string,
    public summary: string,
    public tickers: string[],
    public isDeleted: boolean,
    public subscriberId: string,
    public createdAt: Date,
  ) {}
}