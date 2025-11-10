import { Injectable } from "@nestjs/common";
import { MarketService } from "../services/market.service";

@Injectable()
export class MarketUseCase {
  constructor(
    private readonly marketService: MarketService
  ) {}

  async getMarketData(ticker: string) {
    return this.marketService.fetchMarketData(ticker);
  }

  async extractMarketDataBySymbol(ticker: string) {
    return this.marketService.extractMarketDataBySymbol(ticker);
  }
}