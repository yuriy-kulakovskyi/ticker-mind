export interface ICreateReport {
  subscriberId: string;
  title: string;
  tickers?: string[];
  watchlistId?: string;
}