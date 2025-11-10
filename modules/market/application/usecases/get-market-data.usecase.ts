import { Injectable, Logger } from "@nestjs/common";
import { MarketService } from "../services/market.service";
import { Market } from "modules/market/domain/entities/market.entity";


@Injectable()
export class GetMarketDataUseCase {
  private readonly logger = new Logger(GetMarketDataUseCase.name);

  constructor(private readonly marketService: MarketService) {}

  async execute(ticker: string): Promise<Market> {
    this.logger.log(`Retrieving market data for ticker: ${ticker}`);
    const market = await this.marketService.extractMarketDataBySymbol(ticker);
    this.logger.log(`Successfully retrieved market data for ticker: ${ticker}`);
    return market;
  }
}
