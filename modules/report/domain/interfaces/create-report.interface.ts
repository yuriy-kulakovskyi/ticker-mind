export interface ICreateReport {
  subscriberId: string;
  subscriberEmail: string;
  title: string;
  tickers?: string[];
  watchlistId?: string;
}