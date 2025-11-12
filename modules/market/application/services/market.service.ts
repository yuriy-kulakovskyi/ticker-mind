import { Injectable, Inject, Logger } from "@nestjs/common";
import { IMarketDataProvider } from "@market/domain/interfaces/market-data-provider.interface";
import { IMarketStorage } from "@market/domain/interfaces/market-storage.interface";
import { Market } from "@market/domain/entities/market.entity";

@Injectable()
export class MarketService {
  private readonly logger = new Logger(MarketService.name);

  constructor(
    @Inject('IMarketDataProvider')
    private readonly marketDataProvider: IMarketDataProvider,
    
    @Inject('IMarketStorage')
    private readonly marketStorage: IMarketStorage,
  ) {}

  /**
   * Fetches market data from external API and saves it to database
   * @param ticker - Stock symbol
   * @returns Market data
   */
  async fetchMarketData(ticker: string): Promise<Market> {
    const market = await this.marketDataProvider.getMarketData(ticker);
    await this.marketStorage.saveMarketData(market, ticker);
    this.logger.log(`Fetched and saved market data for ${ticker}`);
    return market;
  }

  /**
   * Retrieves market data from database only
   * @param ticker - Stock symbol
   * @returns Market data from storage
   */
  async extractMarketDataBySymbol(ticker: string): Promise<Market> {
    return this.marketStorage.extractMarketDataBySymbol(ticker);
  }
}