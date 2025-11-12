import { Injectable, Logger } from "@nestjs/common";
import { MarketService } from "@market/application/services/market.service";
import { Market } from "@market/domain/entities/market.entity";


@Injectable()
export class SyncMarketDataUseCase {
  private readonly logger = new Logger(SyncMarketDataUseCase.name);

  constructor(private readonly marketService: MarketService) {}

  async execute(ticker: string): Promise<Market> {
    this.logger.log(`Syncing market data for ticker: ${ticker}`);
    const market = await this.marketService.fetchMarketData(ticker);
    this.logger.log(`Successfully synced market data for ticker: ${ticker}`);
    return market;
  }
}
