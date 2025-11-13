import { Market } from "@market/domain/entities/market.entity";

export interface IMarketDataProvider {
  /**
   * Fetches market data from external source
   * @param ticker - Stock symbol (e.g., 'AAPL')
   * @returns Promise with Market entity
   */
  getMarketData(ticker: string): Promise<Market>;
}
