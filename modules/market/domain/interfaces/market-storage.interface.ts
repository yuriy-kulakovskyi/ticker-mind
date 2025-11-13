import { Market } from "@market/domain/entities/market.entity";

export interface IMarketStorage {
  /**
   * Saves market data to storage
   * @param market - Market entity to save
   * @param ticker - Stock symbol
   */
  saveMarketData(market: Market, ticker: string): Promise<void>;

  /**
   * Retrieves market data from storage by symbol
   * @param symbol - Stock symbol
   * @returns Promise with Market entity
   * @throws NotFoundException if not found
   */
  extractMarketDataBySymbol(symbol: string): Promise<Market>;
}
