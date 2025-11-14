import { Controller, Get, HttpCode, HttpStatus, Post, Query } from "@nestjs/common";
import { GetMarketDataQueryDto } from "@shared/dto/market/get-market-data.dto";
import { SyncMarketDataUseCase } from "@market/application/usecases/sync-market-data.usecase";
import { GetMarketDataUseCase } from "@market/application/usecases/get-market-data.usecase";
import { CacheKey, CacheTTL } from "@nestjs/cache-manager";


@Controller("market")
@CacheKey('market')
@CacheTTL(300)
export class MarketController {
  constructor(
    private readonly syncMarketDataUseCase: SyncMarketDataUseCase,
    private readonly getMarketDataUseCase: GetMarketDataUseCase,
  ) {}

  /**
   * GET /market?ticker=AAPL
   * Retrieves market data from database (fast, cached)
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  getMarketData(@Query() query: GetMarketDataQueryDto) {
    return this.getMarketDataUseCase.execute(query.ticker);
  }

  /**
   * POST /market/sync?ticker=AAPL
   * Fetches fresh data from external API and saves to database (slow, deliberate)
   */
  @Post("sync")
  @HttpCode(HttpStatus.CREATED)
  syncMarketData(@Query() query: GetMarketDataQueryDto) {
    return this.syncMarketDataUseCase.execute(query.ticker);
  }
}